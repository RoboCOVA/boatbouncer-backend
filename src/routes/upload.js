import { Router } from 'express';
import { uploadBoatPhotosValidator } from '../validators/upload.validators';
import parseValidationResult from '../validators/errors.parser';
import { multipleImageUpload } from '../config/multer';
import { finishBoatPhotoUpload } from '../controller/uploads';

const router = Router();

router.post(
  '/public/:resource',
  uploadBoatPhotosValidator(),
  parseValidationResult,
  multipleImageUpload,
  finishBoatPhotoUpload
);
export default router;
