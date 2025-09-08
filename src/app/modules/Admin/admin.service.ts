import { Prisma, PrismaClient } from "@prisma/client";
import { searchAbleFieldsForSearchTerm } from "./admin.constants";

const prisma = new PrismaClient();

const getAllAdmins = async (params: any, options: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];

  const { searchTerm, ...filterData } = params;
  const { page, limit } = options;

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
  // console.dir(whereConditions, { depth: "infinify" });/
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  return result;
};

export const adminServices = {
  getAllAdmins,
};
