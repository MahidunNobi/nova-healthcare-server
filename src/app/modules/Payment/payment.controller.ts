import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { paymentServices } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { appointmentId } = req.params;
  const result = await paymentServices.initPayment(appointmentId!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment initiated successfully!",
    data: result,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentServices.validatePayment(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment validated successfully!",
    data: result,
  });
});

export const paymentController = {
  initPayment,
  validatePayment,
};
