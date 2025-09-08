import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { filterableFields } from "./admin.constants";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filter = req.query && pick(req.query, filterableFields);
    const options =
      req.query && pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await adminServices.getAllAdmins(filter, options);

    res.status(200).json({
      success: true,
      message: "Retrived admins successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.name,
      error,
    });
  }
};

const getAdminById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id!;
    const result = await adminServices.getAdminById(id);

    res.status(200).json({
      success: true,
      message: "Retrived admin successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.name,
      error,
    });
  }
};

const updateAdminById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id!;
    const body = req.body;
    const result = await adminServices.updateAdminById(id, body);

    res.status(200).json({
      success: true,
      message: "Admin Updated successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.name,
      error,
    });
  }
};

export const adminController = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
};
