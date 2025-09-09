import express from "express";
import { UserRoutes } from "../modules/Users/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    routes: UserRoutes,
  },
  {
    path: "/admin",
    routes: adminRoutes,
  },
];

moduleRoutes.map((route) => router.use(route.path, route.routes));

export default router;
