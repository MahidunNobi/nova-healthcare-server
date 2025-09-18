import { Router } from "express";
import { scheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  scheduleController.createDoctorSchedule
);

export const doctorScheduleRoutes = router;
