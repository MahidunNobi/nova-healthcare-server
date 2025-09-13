import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prismaClient";
import { fileUploader } from "../../Helpers/fileUploader";
import { UploadApiResponse } from "cloudinary";
import { Request } from "express";
import { IPagination } from "../../interfaces/pagination";
import paginationHelper from "../../../shared/paginationHelper";
import { UserSearchableFieldsForSearchTerm } from "./user.constants";

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

const getAllUsers = async (params: any, options: IPagination) => {
  const andConditions: Prisma.UserWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(options);
  console.log(params);
  if (params.searchTerm) {
    andConditions.push({
      OR: UserSearchableFieldsForSearchTerm.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateUserStatus = async (id: string, status: UserStatus) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });
  return updateUserStatus;
};

const getMyProfile = async (userData: { email: string; role: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData.email,
    },
    select: {
      email: true,
      needPasswordChange: true,
      status: true,
    },
  });

  let profileData;
  if (
    userData.role === UserRole.ADMIN ||
    userData.role === UserRole.SUPER_ADMIN
  ) {
    profileData = await prisma.admin.findUnique({
      where: { email: user.email },
    });
  } else if (userData.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.findUnique({
      where: { email: user.email },
    });
  } else if (userData.role === UserRole.PATIENT) {
    profileData = await prisma.patient.findUnique({
      where: { email: user.email },
    });
  }

  return { ...user, ...profileData };
};

const updateMyProfile = async (
  userData: { email: string; role: string },
  payload: Partial<Admin | Doctor | Patient>
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData.email,
    },
  });
  console.log(userData, payload);
  let profileData;
  if (
    userData.role === UserRole.ADMIN ||
    userData.role === UserRole.SUPER_ADMIN
  ) {
    profileData = await prisma.admin.update({
      where: { email: user.email },
      data: payload,
    });
  } else if (userData.role === UserRole.DOCTOR) {
    profileData = await prisma.doctor.update({
      where: { email: user.email },
      data: payload,
    });
  } else if (userData.role === UserRole.PATIENT) {
    profileData = await prisma.patient.update({
      where: { email: user.email },
      data: payload,
    });
  }

  return { ...profileData };
};

export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  updateUserStatus,
  getMyProfile,
  updateMyProfile,
};
