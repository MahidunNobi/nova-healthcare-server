import nodemailer from "nodemailer";
import config from "../../config";

const emailSender = async (email: string, sub: string, html: string) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email_sender.email,
      pass: config.email_sender.app_pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Nova Health Care" <mdmahidunnobi@gmail.com>',
    to: email,
    subject: sub,
    // text: "Hello world?", // plain‑text body
    html, // HTML body
  });

  console.log("Message sent:", info.messageId);
};

export default emailSender;
