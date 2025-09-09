import { Admin, Prisma, UserStatus } from "@prisma/client";
import { searchAbleFieldsForSearchTerm } from "./admin.constants";
import paginationHelper from "../../../shared/paginationHelper";
import prisma from "../../../shared/prismaClient";
import { IFilterTypes } from "./admin.interface";
import { IPagination } from "../../interfaces/pagination";

const getAllAdmins = async (params: IFilterTypes, options: IPagination) => {
  console.log(options);
  const andConditions: Prisma.AdminWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(options);

  if (params.searchTerm) {
    andConditions.push({
      OR: searchAbleFieldsForSearchTerm.map((field) => ({
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
  andConditions.push({
    isDeleted: false,
  });
  const whereConditions = { AND: andConditions };

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.admin.count({
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

const getAdminById = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateAdminById = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  const result = await prisma.admin.update({
    where: {
      id,
      isDeleted: false,
    },
    data,
  });
  return result;
};

const deleteAdminById = async (id: string): Promise<Admin | null> => {
  // Check if the user exists or not
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (tc) => {
    const deleteAdmin = await tc.admin.delete({
      where: {
        id,
      },
    });
    await tc.user.delete({
      where: {
        email: deleteAdmin.email,
      },
    });
    return deleteAdmin;
  });
  return result;
};

const softDeleteAdmin = async (id: string): Promise<Admin | null> => {
  // Check if the user exists or not
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (tc) => {
    const deleteAdmin = await tc.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await tc.user.update({
      where: {
        email: deleteAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deleteAdmin;
  });
  return result;
};

export const adminServices = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdmin,
};
