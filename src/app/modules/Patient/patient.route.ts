import { Router } from "express";
import { patientController } from "./patient.controller";

const router = Router();

router.get("/", patientController.getAllDoctors);

router.patch("/:id", patientController.updatePatientById);

router.delete("/:id", patientController.deletePatientById);

export const patientRoutes = router;
