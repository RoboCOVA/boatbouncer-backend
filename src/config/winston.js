import winston from 'winston';

const fileOptions = {
  maxSize: 2e6,
};

const transports = [
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    ...fileOptions,
  }),
  new winston.transports.File({
    filename: 'logs/combined.log',
    ...fileOptions,
  }),
];

/**
 * Hosted environments collect stdout/stderr; the log files above sit on an
 * ephemeral disk nobody can read. Without a console transport every production
 * error is written somewhere invisible — which is exactly what happened to the
 * Identity Toolkit SMS failures, whose full Google payload
 * `logIdentityToolkitSmsError` had been recording where no one could see it.
 */
if (process.env.NODE_ENV !== 'test') {
  transports.push(new winston.transports.Console());
}

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports,
});

export default winstonLogger;
