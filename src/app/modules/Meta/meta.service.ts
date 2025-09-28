import { UserRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import prisma from "../../../shared/prismaClient";

const getDashboardMetaData = async (user: IAuthUser) => {
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData();
      break;
    case UserRole.PATIENT:
      getPatientMetaData();
      break;

    default:
      break;
  }
};

const getSuperAdminMetaData = () => {};
const getAdminMetaData = async () => {
  const doctorCount = await prisma.doctor.count();
  const patientCount = await prisma.patient.count();
  const appointmentCount = await prisma.appointment.count();
  const paymentCount = await prisma.payment.count();

  const totalReverue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });

  return {
    doctorCount,
    patientCount,
    appointmentCount,
    paymentCount,
    totalReverue,
  };
};
const getDoctorMetaData = () => {};
const getPatientMetaData = () => {};

export const metaService = {
  getDashboardMetaData,
};
