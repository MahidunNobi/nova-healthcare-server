import { Doctor } from "@prisma/client";
import prisma from "../../../shared/prismaClient";

const getAllDoctors = async () => {
  const result = await prisma.doctor.findMany();
  return result;
};

const updateDoctorById = async (
  id: string,
  data: { specialties: string[] } & Partial<Doctor>
): Promise<Doctor | null> => {
  // Check if the doctor exists of not
  const docInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const { specialties, ...docData } = data;

  const result = await prisma.$transaction(async (TC) => {
    const doctorUpdateData = await prisma.doctor.update({
      where: {
        id,
        isDeleted: false,
      },
      data: docData,
      include: {
        DoctorSpecialties: true,
      },
    });

    for (const id of specialties) {
      await prisma.doctorSpecialties.create({
        data: {
          specialitiesId: id,
          doctorId: docInfo.id,
        },
      });
    }
    return doctorUpdateData;
  });

  return result;
};

export const doctorServices = {
  getAllDoctors,
  updateDoctorById,
};
