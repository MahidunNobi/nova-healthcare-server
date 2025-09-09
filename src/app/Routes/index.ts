import express from "express";
import { UserRoutes } from "../modules/Users/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { authRoutes } from "../modules/Auth/auth.routes";

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
  {
    path: "/auth",
    routes: authRoutes,
  },
];

moduleRoutes.map((route) => router.use(route.path, route.routes));

export default router;
