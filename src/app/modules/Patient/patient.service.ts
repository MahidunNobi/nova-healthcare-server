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

export const patientService = {
  getAllPatients,
};
