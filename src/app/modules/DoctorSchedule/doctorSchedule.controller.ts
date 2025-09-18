import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
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

    const result = await doctorScheduleService.getMySchedules(
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
    const result = await doctorScheduleService.createDoctorSchedule(
      user!,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Schedule created successfully",
      data: result,
    });
  }
);

const deleteDoctorSchedule = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const result = await doctorScheduleService.deleteMySchedule(
      req.user!,
      req.params.id!
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Schedule Deleted successfully",
      data: result,
    });
  }
);

export const doctorScheduleController = {
  createDoctorSchedule,
  getMySchedule,
  deleteDoctorSchedule,
};
