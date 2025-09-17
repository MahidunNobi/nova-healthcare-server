import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { scheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";

const createDoctorSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await scheduleService.createDoctorSchedule(req.body);

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
