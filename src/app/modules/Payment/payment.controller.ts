import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { paymentServices } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.initPayment();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment initiated successfully!",
    data: result,
  });
});

export const paymentController = {
  initPayment,
};
