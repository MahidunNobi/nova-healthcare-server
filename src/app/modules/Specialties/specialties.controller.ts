import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SpecialtiesService } from "./specialties.service";

const insertIntoDb = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialtiesService.insertIntoDb(req);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Specialties created successfully!",
      data: result,
    });
  }
);

export const specialtiesController = {
  insertIntoDb,
};
