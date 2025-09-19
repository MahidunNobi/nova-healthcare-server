import { Router } from "express";
import { appointmentController } from "./appoinment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.post("/", auth(UserRole.PATIENT), appointmentController.createSchedule);

export const appointmentRoutes = router;
