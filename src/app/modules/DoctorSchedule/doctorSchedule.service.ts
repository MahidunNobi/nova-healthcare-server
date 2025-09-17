import { addHours, addMinutes } from "date-fns";
import prisma from "../../../shared/prismaClient";

const createDoctorSchedule = async (payload: any) => {
  console.log("create DR SCHEDULE");
};

export const scheduleService = {
  createDoctorSchedule,
};
