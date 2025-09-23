import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prismaClient";

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

  console.log(appointmentData);

  const data = {
    store_id: config.ssl.store_id,
    store_passwd: config.ssl.store_pass,
    total_amount: 100,
    currency: "BDT",
    tran_id: appointmentData.Payment?.transactionId, // use unique tran_id for each api call
    success_url: config.ssl.success_url,
    fail_url: config.ssl.fail_url,
    cancel_url: config.ssl.cancle_url,
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "N/A",
    product_name: "N/A",
    product_category: "N/A",
    product_profile: "N/A",
    cus_name: appointmentData.patient.name,
    cus_email: appointmentData.patient.email,
    cus_add1: appointmentData.patient.address,
    cus_add2: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "N/A",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const response = await axios({
    method: "POST",
    url: config.ssl.transection_api!,
    data,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  console.log(response.data);
};

export const paymentServices = {
  initPayment,
};
