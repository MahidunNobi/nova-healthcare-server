import { Doctor } from "@prisma/client";
import prisma from "../../../shared/prismaClient";

type specialtiesType = {
  id: string;
  isDeleted: boolean;
};

const getAllDoctors = async () => {
  const result = await prisma.doctor.findMany();
  return result;
};

const updateDoctorById = async (
  id: string,
  data: { specialties: specialtiesType[] } & Partial<Doctor>
): Promise<Doctor | null> => {
  // Check if the doctor exists of not
  const docInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const { specialties, ...docData } = data;

  const deleteSpecialties: specialtiesType[] = [];
  const createSpecialties: specialtiesType[] = [];

  for (const specialty of specialties) {
    if (specialty.isDeleted) {
      deleteSpecialties.push(specialty);
    } else {
      createSpecialties.push(specialty);
    }
  }

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

    // Deleting  specialities
    for (const specility of deleteSpecialties) {
      await TC.doctorSpecialties.deleteMany({
        where: {
          specialitiesId: specility.id,
          doctorId: docInfo.id,
        },
      });
    }
    // Creating  specialities
    for (const specility of createSpecialties) {
      await TC.doctorSpecialties.create({
        data: {
          specialitiesId: specility.id,
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
