import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { metaController } from "./meta.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  metaController.getDashboardMetaData
);

export const meteRoutes = router;
