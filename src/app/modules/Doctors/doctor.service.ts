import prisma from "../../../shared/prismaClient";

const getAllDoctors = async () => {
  const result = await prisma.doctor.findMany();
  return result;
};

export const doctorServices = {
  getAllDoctors,
};
