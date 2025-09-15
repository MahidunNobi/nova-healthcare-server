import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { doctorServices } from "./doctor.service";
import sendResponse from "../../../shared/sendResponse";
import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.constants";

const getAllDoctors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filter = req.query && pick(req.query, doctorFilterableFields);
    console.log(filter);
    const options =
      req.query && pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await doctorServices.getAllDoctors(filter, options);

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
      message: "Doctor Updated successfully!!",
      data: result,
    });
  }
);

export const doctorController = {
  getAllDoctors,
  updateDoctorById,
};
