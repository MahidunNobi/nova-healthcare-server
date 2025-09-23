import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.get("/ipn", paymentController.validatePayment);

router.post("/initiate-payment/:appointmentId", paymentController.initPayment);

export const paymentRoutes = router;
