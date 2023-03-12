import Joi from 'joi';
import dotenv from 'dotenv';

// Initiate dotenv to interact with .env file values
dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'test', 'production')
    .default('development'),
  MONGO_URL: Joi.string().required().description('MongoDb connection URL'),
  PORT: Joi.number().default(5000),
  JWT_KEY: Joi.string().required(),
  GOOGLE_CONSOLE_KEY: Joi.string().required(),
})
  .unknown()
  .required();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Env vars validation error: ${error.message}`);
}

export const nodeEnv = value.NODE_ENV;
export const port = value.PORT;
export const mongoUrl =
  value.NODE_ENV === 'test' ? value.MONGO_TEST_URL : value.MONGO_URL;
export const jwtKey = value.JWT_KEY;
export const googleConsoleKey = value.GOOGLE_CONSOLE_KEY;
