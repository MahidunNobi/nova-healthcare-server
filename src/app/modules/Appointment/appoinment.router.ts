import { Router } from "express";
import { appointmentController } from "./appoinment.controller";

const router = Router();

router.post("/", appointmentController.createSchedule);

export const appointmentRoutes = router;
