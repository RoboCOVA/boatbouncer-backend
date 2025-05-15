import multer from 'multer';
import { publicResources } from '../utils/constants';
import { uploadImageSizeLimitInMB } from './environments';

const getResourceBasedMaxUploadFileLimit = (resource) => {
  switch (resource) {
    case publicResources.BOAT:
      return 20;
    default:
      return 1;
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
