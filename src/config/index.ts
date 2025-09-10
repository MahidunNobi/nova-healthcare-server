import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
  },
  reset_password_url: process.env.RESET_PASS_URL,
  email_sender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
};
