import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import multer from "multer";
import path from "path";
import { fileUploader } from "../../Helpers/fileUploader";

const router = express.Router();

router.post(
  "/",
  auth("ADMIN", "SUPER_ADMIN"),
  fileUploader.upload.single("file"),
  userController.createAdmin
);

export const UserRoutes = router;
