import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllAdmins = async (params: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  const whereConditions = { AND: andConditions };
  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};

export const adminServices = {
  getAllAdmins,
};
