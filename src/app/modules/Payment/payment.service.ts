import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prismaClient";
import { sslServices } from "../SSL/ssl.services";

const initPayment = async (appointmentId: string) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      Payment: true,
      patient: true,
    },
  });

  const initPaymentData = {
    transection_id: appointmentData.Payment?.transactionId,
    patient_name: appointmentData.patient.name,
    patient_email: appointmentData.patient.email,
    patient_add1: appointmentData.patient.address,
    phone_number: appointmentData.patient.contactNumber,
  };

  const result = await sslServices.initPayment(initPaymentData);

  return {
    paymentUrl: result.GatewayPageURL,
  };
};

export const paymentServices = {
  initPayment,
};
