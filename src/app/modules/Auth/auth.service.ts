import prisma from "../../../shared/prismaClient";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtHelpers } from "../../Helpers/jwtHelpers";
import { UserStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "../../Helpers/emailSender";
import ApiError from "../../errors/apiError";

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
    "1d"
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

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    throw new Error("You are not authorized");
  }
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: isUserExists.email,
      role: isUserExists.role,
    },
    "15min"
  );

  return {
    accessToken,
    needPasswordChange: isUserExists.needPasswordChange,
  };
};

const changePassword = async (UserData: any, payload: any) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: UserData.email,
    },
  });

  const isPasswordCorrect = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Wrong passwod");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 8);

  await prisma.user.update({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: " Password changed successfully!",
  };
};

const forgotPassword = async (payload: any) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const token = jwtHelpers.generateToken(
    {
      email: user.email,
      role: user.role,
    },
    "15min"
  );

  const reset_url = config.reset_password_url + `?id=${user.id}&token=${token}`;

  await emailSender(
    user.email,
    "Reset Password",
    `
    <div> 
        <p> Dear user, </p>
        <p> Reset password  link: 
            <a href="${reset_url}"> 
              <button> RESET </button>
            </a>  
        </p>
    </div>
    `
  );

  return {
    message: "Email send",
  };
};

const resetPassword = async (payload: any, token: string) => {
  if (!token) throw new ApiError(401, "You are not authorized");
  const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  if (!decodedData) throw new ApiError(400, " Forbidden");

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const hashedPassword = await bcrypt.hash(payload.password, 8);

  await prisma.user.update({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
};

export const authServices = {
  userLogin,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
