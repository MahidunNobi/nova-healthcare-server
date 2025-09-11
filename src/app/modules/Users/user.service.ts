import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prismaClient";
import { fileUploader } from "../../Helpers/fileUploader";
import { UploadApiResponse } from "cloudinary";
import { Request } from "express";

const createAdmin = async (req: Request) => {
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

const createDoctor = async (req: Request) => {
  const file = req.file;
  if (file) {
    const cloudinaryUploadsData: void | UploadApiResponse =
      await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = cloudinaryUploadsData?.secure_url;
  }

  const data = req.body;

  const hashedPassword = await bcrypt.hash(data.password, 8);

  const userData = {
    password: hashedPassword,
    email: data.doctor.email,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transectionClient) => {
    const createUser = await transectionClient.user.create({
      data: userData,
    });

    const createDoctor = await transectionClient.doctor.create({
      data: data.doctor,
    });
    return createDoctor;
  });

  return result;
};

const createPatient = async (req: Request) => {
  const file = req.file;
  if (file) {
    const cloudinaryUploadsData: void | UploadApiResponse =
      await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = cloudinaryUploadsData?.secure_url;
  }

  const data = req.body;

  const hashedPassword = await bcrypt.hash(data.password, 8);

  const userData = {
    password: hashedPassword,
    email: data.patient.email,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transectionClient) => {
    const createUser = await transectionClient.user.create({
      data: userData,
    });

    const createPatient = await transectionClient.patient.create({
      data: data.patient,
    });
    return createPatient;
  });

  return result;
};

export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
};
