import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { filterableFields } from "./admin.constants";
import sendResponse from "../../../shared/sendResponse";

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

const getAllAdmins = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

const getAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id!;
    const result = await adminServices.getAdminById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Retrived admin successfully!",
      data: result,
    });
  }
);

const updateAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id!;
    const body = req.body;
    const result = await adminServices.updateAdminById(id, body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Updated successfully!",
      data: result,
    });
  }
);

const deleteAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id!;
    const result = await adminServices.deleteAdminById(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Deleted successfully!",
      data: result,
    });
  }
);

const softDeleteAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id!;
    const result = await adminServices.softDeleteAdmin(id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin Deleted successfully!",
      data: result,
    });
  }
);

export const adminController = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  softDeleteAdminById,
};
