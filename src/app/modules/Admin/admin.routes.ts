import express from "express";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/", adminController.getAllAdmins);

router.get("/:id", adminController.getAdminById);

router.patch("/:id", adminController.updateAdminById);

router.delete("/:id", adminController.deleteAdminById);

export const adminRoutes = router;
