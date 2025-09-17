import { Prisma } from "@prisma/client";
import paginationHelper from "../../../shared/paginationHelper";
import { patientSearchableForSearchTerm } from "./patient.contant";
import prisma from "../../../shared/prismaClient";

const getAllPatients = async (params: any, options: any) => {
  // const result = await prisma.doctor.findMany();
  // return result;

  const andConditions: Prisma.PatientWhereInput[] = [];
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(options);

  if (params.searchTerm) {
    andConditions.push({
      OR: patientSearchableForSearchTerm.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
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

  andConditions.push({
    isDeleted: false,
  });
  const whereConditions = { AND: andConditions };

  const result = await prisma.patient.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      PatientHealthData: true,
      MedicalReport: true,
    },
  });
  const total = await prisma.patient.count({
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

const updatePatientById = async (id: string, payload: any) => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (Tc) => {
    // update patient
    await Tc.patient.update({
      where: {
        id,
      },
      data: patientData,
      include: {
        PatientHealthData: true,
        MedicalReport: true,
      },
    });
    console.log(id);
    //   update Patient Health Data
    if (patientHealthData) {
      await Tc.patientHealthData.upsert({
        where: { patientId: id },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: id },
      });
    }

    // create medical report
    if (medicalReport) {
      await Tc.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  const result = await prisma.patient.findUnique({
    where: {
      id,
    },
    include: {
      PatientHealthData: true,
      MedicalReport: true,
    },
  });
  return result;
};

const deletePatientById = async (id: string) => {
  await prisma.patient.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (Tc) => {
    // delete Medical Record
    await Tc.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });

    // Delete Patient Health Data
    await Tc.patientHealthData.delete({
      where: {
        patientId: id,
      },
    });

    // Delete Patient Data
    const deletedPatient = await Tc.patient.delete({
      where: {
        id,
      },
    });

    // Delete User
    await Tc.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient;
  });

  return result;
};

export const patientService = {
  getAllPatients,
  updatePatientById,
  deletePatientById,
};
