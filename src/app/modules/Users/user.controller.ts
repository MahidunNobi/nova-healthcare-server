import { Request, Response } from "express";
import { userServices } from "./user.service";

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

export const userController = {
  createAdmin,
};
