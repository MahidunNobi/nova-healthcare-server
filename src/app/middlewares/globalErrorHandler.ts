import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  res.status(500).json({
    success: false,
    message: err.message || err.name || "Something went wrong",
    error: err,
  });
};

export default globalErrorHandler;
