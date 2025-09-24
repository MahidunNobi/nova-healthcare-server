import prisma from "../../../shared/prismaClient";
import { IAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";
import { IPagination } from "../../interfaces/pagination";
import { AppointmentStatus, Prisma, UserRole } from "@prisma/client";
import paginationHelper from "../../../shared/paginationHelper";
import app from "../../../app";

const getAllAppointments = async (
  filters: any,
  options: IPagination,
  user: IAuthUser
) => {
  const andConditions: Prisma.AppointmentWhereInput[] = [];
  const { ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(options);

  if (user?.role == UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: user.email,
      },
    });
  } else if (user?.role == UserRole.DOCTOR) {
    andConditions.push({
      doctor: {
        email: user.email,
      },
    });
  }

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
  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.appointment.count({
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

const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
  });

  const result = await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status,
    },
  });

  return result;
};

export const appoinmentService = {
  createAppoinment,
  getAllAppointments,
  updateAppointmentStatus,
};
