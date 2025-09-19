import { IAuthUser } from "../../interfaces/common";

const createAppoinment = async (user: IAuthUser, payload: any) => {
  console.log(user, payload);
};

export const appoinmentService = {
  createAppoinment,
};
