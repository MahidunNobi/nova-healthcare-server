import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

const insertIntoDb = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await SpecialtiesService.insertIntoDb();

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
