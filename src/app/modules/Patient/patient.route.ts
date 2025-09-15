import { Router } from "express";
import { patientController } from "./patient.controller";

const router = Router();

router.get("/", patientController.getAllDoctors);

// router.patch("/:id", doctorController.updateDoctorById);

export const patientRoutes = router;
