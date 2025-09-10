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

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authServices.refreshToken(req.cookies.refreshToken);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Logged in successfully",
      data: result,
      //   data: {
      //     accessToken: result.accessToken,
      //     needPasswordChange: result.needPasswordChange,
      //   },
    });
  }
);

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const result = await authServices.changePassword(req.user, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const result = await authServices.forgotPassword(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Please Check your email.",
      data: result,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization!;
    const result = await authServices.resetPassword(req.body, token);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password reset completed",
      data: result,
    });
  }
);

export const authController = {
  userLogin,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
