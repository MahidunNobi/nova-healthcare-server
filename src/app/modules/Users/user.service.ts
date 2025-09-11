import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prismaClient";
import { fileUploader } from "../../Helpers/fileUploader";
import { ICloudinaryResponse } from "../../interfaces/file";
import { UploadApiResponse } from "cloudinary";

const createAdmin = async (req: any) => {
  const file = req.file;
  if (file) {
    const cloudinaryUploadsData: void | UploadApiResponse =
      await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = cloudinaryUploadsData?.secure_url;
  }

  const data = req.body;

  const hashedPassword = await bcrypt.hash(data.password, 8);

  const userData = {
    password: hashedPassword,
    email: data.admin.email,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transectionClient) => {
    const createUser = await transectionClient.user.create({
      data: userData,
    });

    const createAdmin = await transectionClient.admin.create({
      data: data.admin,
    });
    return createAdmin;
  });

  return result;
};

const createDoctor = async () => {
  console.log("Doctor Created");
};

export const userServices = {
  createAdmin,
  createDoctor,
};
