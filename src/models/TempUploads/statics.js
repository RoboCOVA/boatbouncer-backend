/* eslint-disable camelcase */
import mongoose from 'mongoose';
import { v2 as cloudinary } from '../../config/cloudinary';
import { modelNames } from '../constants';

export async function uploadAndSaveUrl({ files, userId }) {
  const failedFiles = [];
  const uploadedFiles = [];
  const TempUploads = this.model(modelNames.TEMP_UPLOADS);
  if (Array.isArray(files) && files?.length) {
    for (let fileIndex = 0; fileIndex < files.length; fileIndex += 1) {
      const file = files[fileIndex];
      const mimeType =
        typeof file?.mimetype === 'string' && file?.mimetype.startsWith('image')
          ? file?.mimetype
          : undefined;
      try {
        if (file && file?.originalname && file?.path) {
          const id = new mongoose.Types.ObjectId();
          // eslint-disable-next-line no-await-in-loop
          const response = await cloudinary.uploader.upload(file?.path, {
            public_id: id.toString(),
          });
          const {
            asset_id,
            url,
            secure_url,
            public_id,
            original_filename,
            etag,
            format,
          } = response;
          const tempUploadEntry = new TempUploads({
            url,
            etag,
            assetId: asset_id,
            secureUrl: secure_url,
            publicId: public_id,
            originalName: original_filename,
            contentType: mimeType,
            fileExtension: format,
            uploadedBy: userId,
          });

          // eslint-disable-next-line no-await-in-loop
          const savedEntry = await tempUploadEntry.save();
          uploadedFiles.push({
            url: savedEntry?.url,
            secureUrl: savedEntry.secureUrl,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        failedFiles.push(file.originalname);
      }
    }
  }
  return { uploadedFiles, failedFiles };
}
