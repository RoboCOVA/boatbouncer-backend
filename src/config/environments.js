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
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  CLOUD_NAME: Joi.string().required(),
  UPLOAD_IMAGE_SIZE_LIMIT_IN_MB: Joi.number().required(),
  STRIPE_PUBLISHABLE_KEY: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  WEBHOOK_SECRET: Joi.string().required(),
  COOKIE_NAME: Joi.string().required(),
  COOKIE_PASSWORD: Joi.string().required(),
  CRYPTO_SECRET: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().email().required(),
  STRIPE_SUCCESS_URL: Joi.string().required(),
  STRIPE_FAILED_URL: Joi.string().required(),
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
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
export const cloudinaryApiKey = value.CLOUDINARY_API_KEY;
export const cloudinaryName = value.CLOUD_NAME;
export const cloudinaryApiSecret = value.CLOUDINARY_API_SECRET;
export const uploadImageSizeLimitInMB = value.UPLOAD_IMAGE_SIZE_LIMIT_IN_MB;
export const stripePublishKey = value.STRIPE_PUBLISHABLE_KEY;
export const stripeSecretKey = value.STRIPE_SECRET_KEY;
export const endpointSecret = value.WEBHOOK_SECRET;
export const cookieName = value.COOKIE_NAME;
export const cookiePassword = value.COOKIE_PASSWORD;
export const cryptoSecret = value.CRYPTO_SECRET;
export const adminPass = value.ADMIN_PASSWORD;
export const adminEmail = value.ADMIN_EMAIL;
export const stripeSuccessUrl = value.STRIPE_SUCCESS_URL;
export const stripeFailedUrl = value.STRIPE_FAILED_URL;
export const twilioAccountSid = value.TWILIO_ACCOUNT_SID;
export const twilioAuthToken = value.TWILIO_AUTH_TOKEN;
