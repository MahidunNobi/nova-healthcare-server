import { Router } from "express";
import { appointmentController } from "./appoinment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get(
  "/",
  auth(UserRole.PATIENT, UserRole.DOCTOR),
  appointmentController.getAllAppointments
);

router.post("/", auth(UserRole.PATIENT), appointmentController.createSchedule);

router.patch("/status/:id", appointmentController.updateAppointmentStatus);

export const appointmentRoutes = router;
