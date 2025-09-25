import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import { reviewService } from "./review.service";

const createReview = catchAsync(
  async (
    req: Request & { user?: IAuthUser },
    res: Response,
    next: NextFunction
  ) => {
    const result = await reviewService.createReview(req.user!, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Prescription created successfully!",
      data: result,
    });
  }
);

export const reviewController = {
  createReview,
};
