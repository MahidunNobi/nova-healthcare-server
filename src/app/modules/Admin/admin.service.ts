import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmins = async (params: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];
  const searchAbleFields = ["name", "email"];
  const { searchTerm, ...filterData } = params;

  if (params.searchTerm) {
    andConditions.push({
      OR: searchAbleFields.map((field) => ({
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
  });
  return result;
};

export const adminServices = {
  getAllAdmins,
};
