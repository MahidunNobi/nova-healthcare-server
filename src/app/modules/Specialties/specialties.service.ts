import { Request } from "express";
import { fileUploader } from "../../Helpers/fileUploader";
import prisma from "../../../shared/prismaClient";

const insertIntoDb = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadData = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadData?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

export const SpecialtiesService = {
  insertIntoDb,
};
