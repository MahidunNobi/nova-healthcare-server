import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdmin(req);
    res.status(200).json({
      success: true,
      message: "Admin Created Successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.name,
      error,
    });
  }
};

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);
  res.status(200).json({
    success: true,
    message: "Doctor Created Successfully!",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
};
