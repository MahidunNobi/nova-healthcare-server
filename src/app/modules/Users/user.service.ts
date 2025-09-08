import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prismaClient";

const createAdmin = async (data: any) => {
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

export const userServices = {
  createAdmin,
};
