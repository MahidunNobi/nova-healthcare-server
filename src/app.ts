import express, { Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/Users/user.routes";
import { adminRoutes } from "./app/modules/Admin/admin.routes";
import router from "./app/Routes";

const app = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send(" Nova Health Care Server .......");
});

app.use("/api/v1", router);

export default app;
