import { diskStorage } from 'multer';
import { extname } from 'path';

export const kycStorageConfig = {
  storage: diskStorage({
    destination: './uploads/kyc', // Ensure this folder exists!
    filename: (req, file, callback) => {
      // Generate unique filename: user-uuid-timestamp.ext
      // Note: We don't have easy access to user ID inside generic multer config easily without hacking req
      // So we use random string + timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `kyc-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      return callback(new Error('Only image or PDF files are allowed!'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
};