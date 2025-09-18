import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { scheduleService } from "./doctorSchedule.service";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const getMySchedule = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const filter =
      req.query &&
      pick(req.query, ["startDateTime", "endDateTime", "isBooked"]);
    const options =
      req.query && pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await scheduleService.getMySchedules(
      filter,
      options,
      req.user!
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "My Schedules data fetched.",
      data: result,
    });
  }
);

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
  getMySchedule,
};
