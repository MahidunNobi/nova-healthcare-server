import { Request, Response } from "express";
import { adminServices } from "./admin.service";

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllAdmins();
    res.status(200).json({
      success: true,
      message: "Retrived admins successfully!",
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

export const adminController = {
  getAllAdmins,
};
