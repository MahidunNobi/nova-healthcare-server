import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
  },
};
