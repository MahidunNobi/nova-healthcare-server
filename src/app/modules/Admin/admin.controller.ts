import { Request, Response } from "express";
import { adminServices } from "./admin.service";

const pick = (obj, keys) => {
  const filter = {};

  for (const key of keys) {
    if (obj && Object.hasOwn(obj, key)) {
      filter[key] = obj[key];
    }
  }
  return filter;
};

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filter = pick(req.query, [
      "name",
      "email",
      "searchTerm",
      "contactNumber",
    ]);
    console.log(filter);

    const result = await adminServices.getAllAdmins(filter);

    res.status(200).json({
      success: true,
      message: "Retrived admins successfully!",
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
};
