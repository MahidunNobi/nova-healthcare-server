import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { scheduleService } from "./schedule.service";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { scheduleFilterableFields } from "./schedule.constants";
import { IAuthUser } from "../../interfaces/common";

const getAllDoctors = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const filter = req.query && pick(req.query, scheduleFilterableFields);
    const options =
      req.query && pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await scheduleService.getAllSchedules(
      filter,
      options,
      req.user!
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedules data fetched.",
      data: result,
    });
  }
);

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
  getAllDoctors,
};
