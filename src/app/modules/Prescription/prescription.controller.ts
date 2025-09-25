import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { prescriptionService } from "./prescription.service";

const createPrescription = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const result = await prescriptionService.createPrescription(
      req.user!,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Prescription created successfully!",
      data: result,
    });
  }
);

export const prescriptionController = {
  createPrescription,
};
