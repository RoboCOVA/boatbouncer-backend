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
import {
  addUser,
  getUser,
  removeUserBySocketId,
  users,
} from './socket/userManagment';
import Conversations from './models/Conversations';
import { socketConstant } from './socket/constants';
import APIError from './errors/APIError';
import { initializEmitters } from './socket/emitters';
import { Scheduler } from './config/scheduler';

const emitter = new EventEmitter();
emitter.setMaxListeners(200); // 1 listener per connected socket; adjust if you expect > 200 concurrent users
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

    // `protect` skips a tick while the previous one is still running. Without
    // it a slow pass overlaps the next and both act on the same offers.
    Cron('*/5 * * * *', { protect: true }, Scheduler);

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

      // Identity always comes from the authenticated handshake, never from the
      // payload of an individual event.
      const socketUserId = socket.request.user?._id?.toString();

      socket.on(socketConstant.USERS, async () => {
        try {
          // Presence is disclosed only for users the caller already shares a
          // conversation with, is sent to the requester alone, and never
          // carries socket ids.
          const conversations = await Conversations.find(
            { members: socketUserId },
            { members: 1 }
          );

          const contactIds = new Set(
            conversations
              .flatMap((conversation) =>
                (conversation.members || []).map((member) => member.toString())
              )
              .filter((id) => id !== socketUserId)
          );

          socket.emit(
            socketConstant.ALL_USERS,
            users
              .filter((user) => contactIds.has(user.userId))
              .map((user) => ({ userId: user.userId }))
          );
        } catch (error) {
          console.error('Failed to resolve online contacts', error);
        }
      });

      socket.on(socketConstant.ADD_USER, () => {
        addUser(socketUserId, socket.id);
      });

      socket.on(
        socketConstant.SEND_MESSAGE,
        async ({ reciverId, msg, conversationId, _id }) => {
          try {
            // Both parties must be members of the conversation being written
            // to, otherwise the relay is a channel for pushing arbitrary text
            // into any online user's open chat.
            const isMember = await Conversations.exists({
              _id: conversationId,
              members: { $all: [socketUserId, reciverId] },
            });

            if (!isMember) return;

            const user = getUser(reciverId);
            if (user) {
              io.to(user.socketId).emit(socketConstant.GET_MESSAGE, {
                senderId: socketUserId,
                msg,
                conversationId,
                _id,
              });
            }
          } catch (error) {
            console.error('Failed to relay message', error);
          }
        }
      );

      socket.on(socketConstant.DISCONNECT, () => {
        removeUserBySocketId(socket.id);
        console.log(socketUserId, 'disconnected');
      });
    });
  }
};
start();
export default app;
