import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { appoinmentService } from "./appoinment.service";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const getAllAppointments = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    console.log(req.query);
    const filter = req.query && pick(req.query, ["status", "paymentStatus"]);
    const options =
      req.query && pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await appoinmentService.getAllAppointments(
      filter,
      options,
      req.user!
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointments data fetched.",
      data: result,
    });
  }
);

const createSchedule = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const result = await appoinmentService.createAppoinment(
      req.user!,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointment created successfully!",
      data: result,
    });
  }
);

export const appointmentController = {
  createSchedule,
  getAllAppointments,
};
