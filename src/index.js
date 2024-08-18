/* eslint-disable no-console */
/* eslint-disable import/first */
import path from 'path';
// Initiate app root
global.appRoot = path.resolve(path.resolve());

import { EventEmitter } from 'events';
import passport from 'passport';
import httpStatus from 'http-status';
import { Cron } from 'croner';
import * as environments from './config/environments';
import connectToDb from './config/mongoose';
import app from './config/express';
import passportInit from './config/passport';
import createServer from './socket';
import { addUser, getUser, removeUser, users } from './socket/userManagment';
import { socketConstant } from './socket/constants';
import APIError from './errors/APIError';
import { initializEmitters } from './socket/emitters';
import { Scheduler } from './config/scheduler';

const emitter = new EventEmitter();
global._emitter = emitter;

// Init passport
passportInit(passport);
const start = async () => {
  if (!module.parent) {
    await connectToDb();
    const server = app.listen(environments.port, () => {
      // eslint-disable-next-line no-console
      console.log(
        `[${environments.nodeEnv}] Server running on localhost:${environments.port}`
      );
    });

    Cron('*/5 * * * *', Scheduler);

    const io = createServer(server, {
      cors: {
        origin: '*',
      },
    });

    // Socket Token Authentcation
    io.use((socket, next) => {
      passport.authenticate(
        'jwt',
        { session: false },
        (error, user, message) => {
          if (error || !user) {
            const theError =
              error instanceof APIError
                ? error
                : new APIError(message, httpStatus.UNAUTHORIZED);
            return next(theError);
          }
          // eslint-disable-next-line no-param-reassign
          socket.request.user = user.clean();
          return next();
        }
      )(socket.request, {}, next);
    });

    io.on(socketConstant.CONNECTION, async (socket) => {
      console.log('Connected');
      initializEmitters(socket);

      socket.on(socketConstant.USERS, () => {
        io.emit(socketConstant.ALL_USERS, users);
      });

      socket.on(socketConstant.ADD_USER, (userId) => {
        addUser(userId, socket.id);
      });

      socket.on(socketConstant.SEND_MESSAGE, ({ senderId, reciverId, msg }) => {
        const user = getUser(reciverId);
        if (user) {
          io.to(user.socketId).emit(socketConstant.GET_MESSAGE, {
            senderId,
            msg,
          });
        }
      });

      socket.on(socketConstant.DISCONNECT, (userId) => {
        removeUser(userId);
        console.log(userId, 'disconnected');
      });
    });
  }
};
start();
export default app;
