import { AppointmentStatus, PaymentStatus } from "@prisma/client";
import prisma from "../../../shared/prismaClient";
import { IAuthUser } from "../../interfaces/common";
import ApiError from "../../errors/apiError";

const createPrescription = async (user: IAuthUser, payload: any) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      paymentStatus: PaymentStatus.PAID,
      status: AppointmentStatus.COMPLETED,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.email !== appointmentData.doctor.email) {
    throw new ApiError(400, "Appointment is not yours!");
  }

  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctor.id,
      patientId: appointmentData.patientId,
      instructions: payload.instructions,
      followUpDate: payload.followUpDate,
    },
  });
  return result;
};

export const prescriptionService = {
  createPrescription,
};
