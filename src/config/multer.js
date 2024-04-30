import httpStatus from 'http-status';
import multer from 'multer';
import APIError from '../errors/APIError';
import { publicResources } from '../utils/constants';
import { uploadImageSizeLimitInMB } from './environments';

const getResourceBasedMaxUploadFileLimit = (resource) => {
  switch (resource) {
    case publicResources.BOAT:
      return 6;
    default:
      return 1;
  }
};

const imagesOnlyFilter = (req, file, cb) => {
  if (typeof file.mimetype === 'string' && file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    const fileTypeError = new APIError(
      'Unsuported file upload',
      httpStatus.BAD_REQUEST
    );

    cb(fileTypeError, false);
  }
};

const getMultipleImageUploaderOption = (resource) => {
  const option = {
    dest: `${__dirname}/temp`,
    // fileFilter: imagesOnlyFilter,
    limits: {
      files: getResourceBasedMaxUploadFileLimit(resource),
      fileSize: uploadImageSizeLimitInMB * 1024 * 1024, // 1 * 1024 *1024 = 1MB
    },
  };
  return option;
};

export const multipleImageUpload = (req, res, next) => {
  const { resource } = req.params;
  const maxCount = getResourceBasedMaxUploadFileLimit(resource);
  multer(getMultipleImageUploaderOption(resource)).array('pictures', maxCount)(
    req,
    res,
    () => {
      next();
    }
  );
};
