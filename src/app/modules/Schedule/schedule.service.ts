import { addHours, addMinutes } from "date-fns";
import prisma from "../../../shared/prismaClient";
import { Prisma } from "@prisma/client";
import paginationHelper from "../../../shared/paginationHelper";
import { IAuthUser } from "../../interfaces/common";
import { IScheduleFilterParams } from "./schedule.interface";
import { IPagination } from "../../interfaces/pagination";

const getAllSchedules = async (
  params: IScheduleFilterParams,
  options: IPagination,
  user: IAuthUser
) => {
  const andConditions: Prisma.ScheduleWhereInput[] = [];
  const { startDateTime, endDateTime } = params;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(options);

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          startDateTime: {
            gte: startDateTime,
          },
        },
        {
          endDateTime: {
            lte: endDateTime,
          },
        },
      ],
    });
  }

  const whereConditions = { AND: andConditions };

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email || "",
      },
    },
  });
  const doctorScheduleIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );
  console.log(doctorScheduleIds);
  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
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

const createSchedule = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const allSchedules = [];

  const firstDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const slotInterval = 30;

  while (firstDate <= lastDate) {
    const firstDateTime = addMinutes(
      addHours(firstDate, Number(startTime.split(":")[0])),
      Number(startTime.split(":")[1])
    );

    const lastDateTime = addMinutes(
      addHours(firstDate, Number(endTime.split(":")[0])),
      Number(endTime.split(":")[1])
    );

    while (firstDateTime < lastDateTime) {
      const schedule = {
        startDateTime: new Date(firstDateTime),
        endDateTime: addMinutes(firstDateTime, slotInterval),
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          ...schedule,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: schedule,
        });

        allSchedules.push(result);
      }

      firstDateTime.setTime(firstDateTime.getTime() + slotInterval * 60 * 1000);
    }

    firstDate.setDate(firstDate.getDate() + 1);
  }
  return allSchedules;
};

export const scheduleService = {
  createSchedule,
  getAllSchedules,
};
