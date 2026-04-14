import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import winstonLogger from './winston';
import * as environments from './environments';
import APIError from '../errors/APIError';
import routes from './routes';
import { stripeWebHookController } from '../controller/webhook';
// import adminRoute from './admin';
// import { adminJs } from './admin/config';

const app = express();

app.use(morgan('dev'));

winstonLogger.stream = {
  write: (message) => {
    winstonLogger.info(message);
  },
};

if (environments.nodeEnv !== 'test') {
  app.use(morgan('combined', { stream: winstonLogger.stream }));
}

// AdminBro/Js
app.use(cors());
// app.use(adminJs.options.rootPath, adminRoute);

// AdminJS is only loaded when ENABLE_ADMIN=true to prevent OOM on low-RAM dynos.
// webpack bundles all custom components at startup and needs ~300-400MB extra heap.
// On Heroku: set ENABLE_ADMIN=true only on a Standard-2X (1GB) dyno.
if (process.env.ENABLE_ADMIN === 'true') {
  // eslint-disable-next-line global-require
  const adminRouteModule = require('./admin').default;
  // eslint-disable-next-line global-require
  const { adminJs: adminJsInstance } = require('./admin/config');
  app.use(adminJsInstance.options.rootPath, adminRouteModule);
  // eslint-disable-next-line no-console
  console.log(
    '[AdminJS] Admin panel enabled at',
    adminJsInstance.options.rootPath
  );
}
// Secure middlewares
app.use(helmet());

// use static files
app.use(express.static(`${__dirname}/../../public`));

// Stripe Webhook Listener
app.use(
  '/webhook/boatBouncer',
  express.raw({ type: 'application/json' }),
  stripeWebHookController
);
app.use(
  express.json({
    limit: '10mb',
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/boatbouncer', routes);

// 404 - endpoint not found
app.use((req, res, next) => {
  const notFoundError = new APIError(
    'Endpoint not found',
    httpStatus.NOT_FOUND,
    true
  );
  return next(notFoundError);
});

// Catch errors passed from controllers
app.use((err, req, res, next) => {
  // Change error catched to APIError if instance is not APIError
  if (!(err instanceof APIError)) {
    const newError = new APIError(
      err.message || 'An unknown error occured',
      httpStatus.INTERNAL_SERVER_ERROR
    );

    return next(newError);
  }

  return next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.status === httpStatus.INTERNAL_SERVER_ERROR) {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  res.status(err.status).send({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: environments.nodeEnv === 'development' ? err.stack : null,
  });
});

export default app;
