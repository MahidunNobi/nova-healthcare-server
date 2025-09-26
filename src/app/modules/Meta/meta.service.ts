import prisma from "../../../shared/prismaClient";
import ApiError from "../../errors/apiError";
import { IAuthUser } from "../../interfaces/common";

const getDashboardMetaData = async (user: IAuthUser) => {};

export const metaService = {
  getDashboardMetaData,
};
