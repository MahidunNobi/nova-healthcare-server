import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { appoinmentService } from "./appoinment.service";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";

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
      message: "Appointment created successfully",
      data: result,
    });
  }
);

export const appointmentController = {
  createSchedule,
};
