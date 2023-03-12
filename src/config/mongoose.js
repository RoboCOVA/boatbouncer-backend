import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import * as environments from './environments';

const modelsPath = path.join(process.cwd(), 'src/models');

// Initialize all models in src/models directory

/* Reading all the files in the models directory and requiring them. */
fs.readdirSync(modelsPath, { withFileTypes: true })
  .filter((dir) => dir.isDirectory())
  // eslint-disable-next-line
  .forEach(dir => require(path.join(modelsPath, dir.name)));

/**
 * It connects to the MongoDB database using the Mongoose library
 * @returns The connection to the database.
 */
const connectToDb = async () => {
  try {
    const connectOptions = {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
    };
    await mongoose.connect(environments.mongoUrl, connectOptions);

    if (environments.nodeEnv !== 'test') {
      // eslint-disable-next-line no-console
      console.info(`Mongo Connection Successfull`);
    }
    return mongoose.connection;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Mongo Connection Failed`, error);
    throw error;
  }
};

export default connectToDb;
