import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

async function uploadToCloudinary(file: any) {
  // Configuration
  cloudinary.config({
    cloud_name: "dlnxfhlfl",
    api_key: "914145195697624",
    api_secret: "ielgnGH8f1vTFoImzA1Kff1Ax8Y", // Click 'View API Keys' above to copy your API secret
  });

  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file.path, {
      public_id: file.originalname,
    })
    .catch((error) => {
      console.log(error);
    });
  // Deleting the file from uploads folder
  fs.unlinkSync(file.path);
  return uploadResult;
}

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
