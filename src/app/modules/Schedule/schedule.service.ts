import { addHours, addMinutes } from "date-fns";
import prisma from "../../../shared/prismaClient";

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
};
