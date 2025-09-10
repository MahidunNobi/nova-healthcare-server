import jwt, { Secret } from "jsonwebtoken";
import config from "../../config";

const generateToken = (payload: any, expiresIn: string) => {
  const token = jwt.sign(payload, config.jwt.jwt_secret as Secret, {
    algorithm: "HS256",
    expiresIn,
  });
  return token;
};

export const jwtHelpers = {
  generateToken,
};
