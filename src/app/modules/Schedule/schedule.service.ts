import { addHours, addMinutes } from "date-fns";
import prisma from "../../../shared/prismaClient";
import { Prisma } from "@prisma/client";
import paginationHelper from "../../../shared/paginationHelper";

const getAllSchedules = async (params: any, options: any) => {
  // const result = await prisma.doctor.findMany();
  // return result;

  const andConditions: Prisma.ScheduleWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(options);

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions = { AND: andConditions };

  const result = await prisma.schedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = await prisma.schedule.count({
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
