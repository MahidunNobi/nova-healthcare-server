import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { metaService } from "./meta.service";

const getDashboardMetaData = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const result = await metaService.getDashboardMetaData(req.user!);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Dashboard fetched successfully! Yeaa",
      data: result,
    });
  }
);

export const metaController = {
  getDashboardMetaData,
};
