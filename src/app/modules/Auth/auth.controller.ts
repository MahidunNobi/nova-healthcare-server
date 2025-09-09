import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authServices.userLogin(req.body);

    res.cookie("refreshToken", result.refreshToken);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Logged in successfully",
      data: {
        accessToken: result.accessToken,
        needPasswordChange: result.needPasswordChange,
      },
    });
  }
);

export const authController = {
  userLogin,
};
