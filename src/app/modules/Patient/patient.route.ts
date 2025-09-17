import { Router } from "express";
import { patientController } from "./patient.controller";

const router = Router();

router.get("/", patientController.getAllDoctors);

router.patch("/:id", patientController.updatePatientById);

router.delete("/:id", patientController.deletePatientById);

router.delete("/soft/:id", patientController.softDeletePatientById);

export const patientRoutes = router;
