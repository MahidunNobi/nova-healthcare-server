import prisma from "../../../shared/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  const accessToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    "abcdef",
    { algorithm: "HS256", expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    "abcdef",
    { algorithm: "HS256", expiresIn: "15m" }
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
