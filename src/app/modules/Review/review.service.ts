import prisma from "../../../shared/prismaClient";
import ApiError from "../../errors/apiError";
import { IAuthUser } from "../../interfaces/common";

const createReview = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email!,
    },
  });

  const appointmentData = await prisma.appointment.findFirstOrThrow({
    where: {
      id: payload.appointmentId,
    },
  });

  if (patientData.id !== appointmentData.patientId) {
    throw new ApiError(400, "This is not your appointment!");
  }
  const result = await prisma.review.create({
    data: {
      appointmentId: appointmentData.id,
      doctorId: appointmentData.doctorId,
      patientId: appointmentData.patientId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  // calculate doctors avg ratting
  await prisma.$transaction(async (tx) => {
    const averageRatting = await tx.review.aggregate({
      _avg: {
        rating: true,
      },
    });

    await tx.doctor.update({
      where: {
        id: appointmentData.doctorId,
      },
      data: {
        averageRatting: averageRatting._avg.rating || 0,
      },
    });

    console.log(averageRatting);
  });

  return result;
};

export const reviewService = {
  createReview,
};
