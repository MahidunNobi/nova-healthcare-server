import jwt from "jsonwebtoken";

const generateToken = (payload: any, expiresIn: string) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    algorithm: "HS256",
    expiresIn,
  });
  return token;
};

export const jwtHelpers = {
  generateToken,
};
