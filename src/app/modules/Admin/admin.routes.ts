import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidationSchemas } from "./admin.validation.schema";

const router = express.Router();

router.get("/", adminController.getAllAdmins);

router.get("/:id", adminController.getAdminById);

router.patch(
  "/:id",
  validateRequest(adminValidationSchemas.updateAdmin),
  adminController.updateAdminById
);

router.delete("/:id", adminController.deleteAdminById);

router.delete("/soft/:id", adminController.softDeleteAdminById);

export const adminRoutes = router;
