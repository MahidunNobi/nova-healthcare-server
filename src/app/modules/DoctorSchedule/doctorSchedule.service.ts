import { IAuthUser } from "./../../interfaces/common";
import prisma from "../../../shared/prismaClient";
import { IPagination } from "../../interfaces/pagination";
import { Prisma } from "@prisma/client";
import paginationHelper from "../../../shared/paginationHelper";

const getMySchedules = async (
  params: any,
  options: IPagination,
  user: IAuthUser
) => {
  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];
  const { startDateTime, endDateTime, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(options);

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDateTime,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDateTime,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (filterData.isBooked === "true") {
      filterData.isBooked = true;
    } else if (filterData.isBooked === "false") {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions = { AND: andConditions };

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {},
    include: {
      schedule: true,
    },
  });
  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

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
  getMySchedules,
};
