import prisma from "../../../shared/prismaClient";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { jwtHelpers } from "../../Helpers/jwtHelpers";

const userLogin = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Wrong passwod");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: user.email,
      role: user.role,
    },
    "15min"
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: user.email,
      role: user.role,
    },
    "15d"
  );

  return {
    accessToken,
    needPasswordChange: user.needPasswordChange,
    refreshToken,
  };
};

export const authServices = {
  userLogin,
};
