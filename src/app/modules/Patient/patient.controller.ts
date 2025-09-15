import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { patientFilterableFields } from "./patient.contant";
import { patientService } from "./patient.service";
import sendResponse from "../../../shared/sendResponse";

const getAllDoctors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filter = req.query && pick(req.query, patientFilterableFields);
    const options =
      req.query && pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await patientService.getAllPatients(filter, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Patients data fetched.",
      data: result,
    });
  }
);

export const patientController = {
  getAllDoctors,
};
