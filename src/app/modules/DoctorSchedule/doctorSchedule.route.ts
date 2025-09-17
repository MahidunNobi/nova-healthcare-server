import { Router } from "express";
import { scheduleController } from "./doctorSchedule.controller";

const router = Router();

router.post("/", scheduleController.createDoctorSchedule);

export const doctorScheduleRoutes = router;
