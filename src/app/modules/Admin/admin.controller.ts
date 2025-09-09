import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { filterableFields } from "./admin.constants";
import sendResponse from "../../../shared/sendResponse";

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter = req.query && pick(req.query, filterableFields);
    const options =
      req.query && pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await adminServices.getAllAdmins(filter, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrived admins successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id!;
    const result = await adminServices.getAdminById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrived admin successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id!;
    const body = req.body;
    const result = await adminServices.updateAdminById(id, body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Updated successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const deleteAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id!;
    const result = await adminServices.deleteAdminById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Deleted successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const softDeleteAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id!;
    const result = await adminServices.softDeleteAdmin(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Deleted successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const adminController = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdminById,
};
