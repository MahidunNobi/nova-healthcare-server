import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { doctorServices } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";

const getAllDoctors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await doctorServices.getAllDoctors();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctors data fetched.",
      data: result,
    });
  }
);

const updateDoctorById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id!;
    const body = req.body;
    const result = await doctorServices.updateDoctorById(id, body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Updated successfully!",
      data: result,
    });
  }
);

export const doctorController = {
  getAllDoctors,
  updateDoctorById,
};
