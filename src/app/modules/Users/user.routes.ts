import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../Helpers/fileUploader";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/",
  auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res);
  }
);

export const UserRoutes = router;
