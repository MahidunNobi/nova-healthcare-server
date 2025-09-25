import { IAuthUser } from "../../interfaces/common";

const createPrescription = async (user: IAuthUser, payload: any) => {
  console.log("Prescription Created");
};

export const prescriptionService = {
  createPrescription,
};
