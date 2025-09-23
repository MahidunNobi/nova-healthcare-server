import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/", paymentController.initPayment);

export const paymentRoutes = router;
