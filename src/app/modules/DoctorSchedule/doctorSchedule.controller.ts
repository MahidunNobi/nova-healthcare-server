import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { scheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";

const createDoctorSchedule = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const result = await scheduleService.createDoctorSchedule(user!, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Schedule created successfully",
      data: result,
    });
  }
);

export const scheduleController = {
  createDoctorSchedule,
};
