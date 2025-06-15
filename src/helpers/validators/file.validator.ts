import { BadRequestException } from "@nestjs/common";
import { extname, join } from "path";

export const imageFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(|JPG|jpg|jpeg|png|PNG)$/i)) {
    return callback(
      new BadRequestException("Only image files are allowed!"),
      false,
    );
  }
  callback(null, true);
};

export const limitImageUpload = (maxFile?: number) => {
  return {
    fileSize: maxFile ?? 10 * 1024 * 1024,
  };
};

export const storageSetting = {
  destination: join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = file.originalname.replace(/ /g, '-').toLowerCase();
    cb(null, `${filename.replace(ext, '')}-${uniqueSuffix}${ext}`);
  }
}
