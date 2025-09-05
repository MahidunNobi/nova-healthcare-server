import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const createAdmin = async (data: any) => {
  // const { data } = primaryData;
  const userData = {
    password: data.password,
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

export const userServices = {
  createAdmin,
};
