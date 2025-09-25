import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/Users/user.routes";
import { adminRoutes } from "./app/modules/Admin/admin.routes";
import router from "./app/Routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { appoinmentService } from "./app/modules/Appointment/appoinment.service";
import cron from "node-cron";

const app = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send(" Nova Health Care Server .......");
});

cron.schedule("* * * * *", () => {
  appoinmentService.cancelUnpaidAppointments();
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API NOT  FOUND!",
    error: {
      path: req.originalUrl,
      message: "Invalid path",
    },
  });
});

export default app;
