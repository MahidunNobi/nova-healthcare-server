import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { patientFilterableFields } from "./user.constants";
import sendResponse from "../../../shared/sendResponse";

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
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);
  res.status(200).json({
    success: true,
    message: "Patient Created Successfully!",
    data: result,
  });
});

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filter = req.query && pick(req.query, patientFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await userServices.getAllUsers(filter, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrived admins successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);
const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const result = await userServices.updateUserStatus(
      req.params.id!,
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "User Status updated successfully. Only for admins and super admins",
      data: result,
    });
  }
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await userServices.getMyProfile(req.user);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Data fetched successfully!",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log(req.body);
    const result = await userServices.updateMyProfile(req.user, req);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Profile updated successfully!",
      data: result,
    });
  }
);

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  updateUserStatus,
  getMyProfile,
  updateMyProfile,
};
