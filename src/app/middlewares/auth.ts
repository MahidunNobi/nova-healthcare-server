import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";

const auth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) throw new Error("You are not authorized");

    const decodedData = jwt.verify(
      token,
      config.jwt.jwt_secret as Secret
    ) as JwtPayload;
    if (roles.includes(decodedData.role)) {
      next();
    } else {
      throw new Error("You are not authorized");
    }
  });
};

export default auth;
