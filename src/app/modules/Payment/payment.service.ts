import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prismaClient";
import { sslServices } from "../SSL/ssl.services";
import { PaymentStatus } from "@prisma/client";

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

const validatePayment = async (payload: any) => {
  if (!payload || !payload.status || payload.status !== "VALID") {
    return {
      message: "Invalid Payment!",
    };
  }

  const response = await axios({
    method: "GET",
    url: `${config.ssl.validation_api!}?val_id=${payload.val_id}&store_id=${
      config.ssl.store_id
    }&store_passwd=${config.ssl.store_pass}&format=json`,
  });

  if (response.data.status !== "VALID") {
    return {
      message: "Payment failed",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: {
        transactionId: response.data.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
      },
    });
  });
};

export const paymentServices = {
  initPayment,
  validatePayment,
};
