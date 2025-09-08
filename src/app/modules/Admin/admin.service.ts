import { Prisma } from "@prisma/client";
import { searchAbleFieldsForSearchTerm } from "./admin.constants";
import paginationHelper from "../../../shared/paginationHelper";
import prisma from "../../../shared/prismaClient";

const getAllAdmins = async (params: any, options: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  const { limit, skip, sortBy, sortOrder } = paginationHelper(options);

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
          equals: filterData[key],
        },
      })),
    });
  }
  const whereConditions = { AND: andConditions };

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  return result;
};

export const adminServices = {
  getAllAdmins,
};
