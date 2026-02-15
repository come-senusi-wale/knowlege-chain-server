import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max file size
  },
});

const fileFilter = (
  fieldname: string,
  allowedMimeTypes?: string[],
  isRequired: boolean = true,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // if (isRequired && !req.file) {
    //   return res.status(400).json({ message: `${fieldname} is required` });
    // }

    if (
      req.file &&
      allowedMimeTypes &&
      !allowedMimeTypes.includes(req.file.mimetype.split('/')[0])
    ) {
      return res.status(400).json({
        message: `File type not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
      });
    }

    next();
  };
};

export const singleFileUpload = (
  fieldname: string,
  allowedMimeTypes?: string[],
  isRequired: boolean = true,
) => [
  upload.single(fieldname),
  fileFilter(fieldname, allowedMimeTypes, isRequired),
];
