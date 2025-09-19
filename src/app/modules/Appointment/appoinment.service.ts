import prisma from "../../../shared/prismaClient";
import { IAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";

const createAppoinment = async (user: IAuthUser, payload: any) => {
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email!,
    },
  });

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  const doctorSchedule = await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: payload.doctorId,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await prisma.appointment.create({
      data: {
        patientId: patientInfo.id,
        doctorId: doctorInfo.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorInfo.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    const transectionId = uuidv4();

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: Number(doctorInfo.appoinmentFee),
        transactionId: transectionId,
      },
    });

    return appointmentData;
  });

  return result;
};

export const appoinmentService = {
  createAppoinment,
};
