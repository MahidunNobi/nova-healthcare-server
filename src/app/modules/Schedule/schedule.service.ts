import { addHours, addMinutes } from "date-fns";
import prisma from "../../../shared/prismaClient";

const createSchedule = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const allSchedules = [];

  const firstDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const slotInterval = 30;

  while (firstDate <= lastDate) {
    const firstDateTime = addHours(firstDate, Number(startTime.split(":")[0]));

    const lastDateTime = addHours(firstDate, Number(endTime.split(":")[0]));

    while (firstDateTime < lastDateTime) {
      const schedule = {
        startDateTime: new Date(firstDateTime),
        endDateTime: addMinutes(firstDateTime, slotInterval),
      };

      const result = await prisma.schedule.create({
        data: schedule,
      });

      allSchedules.push(result);

      firstDateTime.setTime(firstDateTime.getTime() + slotInterval * 60 * 1000);
    }

    firstDate.setDate(firstDate.getDate() + 1);
  }
  return allSchedules;
};

export const scheduleService = {
  createSchedule,
};
