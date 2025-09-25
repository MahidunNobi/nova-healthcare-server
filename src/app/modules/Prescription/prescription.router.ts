import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { prescriptionController } from "./prescription.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  prescriptionController.createPrescription
);

router.get(
  "/my-prescription",
  auth(UserRole.PATIENT),
  prescriptionController.getMyPrescription
);

export const prescriptionRoutes = router;
