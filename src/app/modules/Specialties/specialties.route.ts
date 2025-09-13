import express, { NextFunction, Request, Response } from "express";
import { specialtiesController } from "./specialties.controller";
import { fileUploader } from "../../Helpers/fileUploader";
import { specialtiesValidation } from "./specialties.validation";

const router = express.Router();

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialtiesValidation.createSpecialties.parse(
      JSON.parse(req.body.data)
    );
    return specialtiesController.insertIntoDb(req, res, next);
  }
);

export const specialtiesRoutes = router;
