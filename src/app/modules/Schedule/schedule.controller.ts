import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { scheduleService } from "./schedule.service";
import sendResponse from "../../../shared/sendResponse";

const createSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await scheduleService.createSchedule(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule created successfully",
      data: result,
    });
  }
);

export const scheduleController = {
  createSchedule,
};
