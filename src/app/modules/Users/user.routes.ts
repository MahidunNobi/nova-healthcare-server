import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../Helpers/fileUploader";
import { userValidation } from "./user.validation";

const router = express.Router();

router.get("/", auth("ADMIN", "SUPER_ADMIN"), userController.getAllUsers);

router.patch(
  "/:id/status",
  auth("ADMIN", "SUPER_ADMIN"),
  userController.updateUserStatus
);

router.post(
  "/create-admin",
  auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res);
  }
);

router.post(
  "/create-doctor",
  auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return userController.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  // auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    return userController.createPatient(req, res, next);
  }
);

export const UserRoutes = router;
