import { v2 } from 'cloudinary';
import {
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryName,
} from './environments';

v2.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

export { v2 };
