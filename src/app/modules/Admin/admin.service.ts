import { Prisma, PrismaClient } from "@prisma/client";
import { searchAbleFieldsForSearchTerm } from "./admin.constants";

const prisma = new PrismaClient();

const calculateQueryOptions = (options: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 50;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

const getAllAdmins = async (params: any, options: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];
  console.log(options);
  const { searchTerm, ...filterData } = params;
  const { limit, skip, sortBy, sortOrder } = calculateQueryOptions(options);

  console.log({ sortBy, sortOrder });
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
