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
  ssl: {
    store_id: process.env.SSL_STORE_ID,
    store_pass: process.env.SSL_STORE_PASS,
    success_url: process.env.SSL_SUCCESS_URL,
    fail_url: process.env.SSL_FAIL_URL,
    cancle_url: process.env.SSL_CANCEL_URL,
    transection_api: process.env.SSL_TRANSECTION_API,
    validation_api: process.env.SSL_VALIDATION_API,
  },
};
