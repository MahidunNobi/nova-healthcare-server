import express from "express";
import { UserRoutes } from "../modules/Users/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { specialtiesRoutes } from "../modules/Specialties/specialties.route";
import { doctorRoutes } from "../modules/Doctors/doctor.route";
import { patientRoutes } from "../modules/Patient/patient.route";
import { scheduleRoutes } from "../modules/Schedule/schedule.route";
import { doctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.route";
import { appointmentRoutes } from "../modules/Appointment/appoinment.router";
import { paymentRoutes } from "../modules/Payment/payment.route";

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
  {
    path: "/doctor",
    routes: doctorRoutes,
  },
  {
    path: "/patient",
    routes: patientRoutes,
  },
  {
    path: "/specialties",
    routes: specialtiesRoutes,
  },
  {
    path: "/schedule",
    routes: scheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    routes: doctorScheduleRoutes,
  },
  {
    path: "/appointment",
    routes: appointmentRoutes,
  },
  {
    path: "/payment",
    routes: paymentRoutes,
  },
  {
    path: "/prescription",
    routes: paymentRoutes,
  },
];

moduleRoutes.map((route) => router.use(route.path, route.routes));

export default router;
