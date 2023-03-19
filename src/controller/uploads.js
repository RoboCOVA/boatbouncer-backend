// import { v2 as cloudinary } from '../config/cloudinary';
import TempUploads from '../models/TempUploads';

export const finishBoatPhotoUpload = async (req, res, next) => {
  try {
    const { files, user } = req;
    const tempUploadEntry = await TempUploads.uploadAndSaveUrl({
      files,
      userId: user?._id,
    });
    res.json(tempUploadEntry);
  } catch (error) {
    next(error);
  }
};
