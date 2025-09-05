import express, { Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/Users/user.routes";

const app = express();

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send(" Nova Health Care Server .......");
});

app.use("/api/v1/user", UserRoutes);

export default app;
