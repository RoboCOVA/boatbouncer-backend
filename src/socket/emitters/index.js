/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line import/prefer-default-export
export const initializEmitters = (io) => {
  const emittersPath = path.resolve(__dirname);

  fs.readdir(emittersPath, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files
        .filter((fileName) => fileName.match(/\.(emitters.js)$/i))
        .forEach((fileName) => {
          // eslint-disable-next-line import/no-dynamic-require, global-require
          const emitter = require(path.resolve(__dirname, fileName));
          emitter.default(io);
        });
    }
  });
};
