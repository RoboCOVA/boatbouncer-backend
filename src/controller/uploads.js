// import { v2 as cloudinary } from '../config/cloudinary';
import TempUploads from '../models/TempUploads';

export const finishBoatPhotoUpload = async (req, res, next) => {
  try {
    const { files, user } = req;
    const tempUploadEntry = await TempUploads.uploadAndSaveUrl({
      files,
      userId: user?._id,
    });
    // const response = await cloudinary.uploader.upload(files?.[0]?.path, {
    //   public_id: 'boats',
    // });
    //   const uploadResults = await TempUploads.uploadAndSaveFiles({
    //     files,
    //     user,
    //     resourceType: resource,
    //     userType: userTypes.ADMINSTRATOR,
    //     keepPublicRead: true,
    //   });
    res.json(tempUploadEntry);
  } catch (error) {
    next(error);
  }
};
