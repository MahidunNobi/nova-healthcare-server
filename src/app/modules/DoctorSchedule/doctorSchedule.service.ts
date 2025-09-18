import { IAuthUser } from "./../../interfaces/common";
import prisma from "../../../shared/prismaClient";

const createDoctorSchedule = async (user: IAuthUser, payload: any) => {
  if (!user) return;

  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user.email,
    },
  });

  const doctorSchedules = payload.scheduleIds.map((scheduleId: string) => ({
    doctorId: doctorData?.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorSchedules,
  });

  return result;
};

export const scheduleService = {
  createDoctorSchedule,
};
