import { UserRole } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(UserRole.PATIENT), reviewController.createReview);

export const reviewRoutes = router;
