import { Doctor, Prisma } from "@prisma/client";
import prisma from "../../../shared/prismaClient";
import paginationHelper from "../../../shared/paginationHelper";
import { doctorSearchableForSearchTerm } from "./doctor.constants";

type specialtiesType = {
  id: string;
  isDeleted: boolean;
};

const getAllDoctors = async (params: any, options: any) => {
  // const result = await prisma.doctor.findMany();
  // return result;

  const andConditions: Prisma.DoctorWhereInput[] = [];
  const { searchTerm, specialties, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper(options);

  if (params.searchTerm) {
    andConditions.push({
      OR: doctorSearchableForSearchTerm.map((field) => ({
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

  if (specialties && specialties.length > 0) {
    andConditions.push({
      DoctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  andConditions.push({
    isDeleted: false,
  });
  const whereConditions = { AND: andConditions };

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      DoctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  const total = await prisma.doctor.count({
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

  // Working on Database
  await prisma.$transaction(async (TC) => {
    await prisma.doctor.update({
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
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      DoctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  return result;
};

export const doctorServices = {
  getAllDoctors,
  updateDoctorById,
};
