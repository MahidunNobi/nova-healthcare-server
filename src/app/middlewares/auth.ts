import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../errors/apiError";

const auth = (...roles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) throw new ApiError(401, "You are not authorized");

    const decodedData = jwt.verify(
      token,
      config.jwt.jwt_secret as Secret
    ) as JwtPayload;
    if (roles.includes(decodedData.role)) {
      next();
    } else {
      throw new ApiError(400, "You are not authorized");
    }
  });
};

export default auth;
