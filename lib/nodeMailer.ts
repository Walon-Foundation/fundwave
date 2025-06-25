import nodemailer from "nodemailer";
import { config } from "../config/config";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.GOOGLE_SMTP_EMAIL,
    pass: config.GOOGLE_SMTP_PASSWORD,
  },
});

const html = (name: string, token: string) => `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 40px; color: #333;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div style="background: #0d6efd; color: white; padding: 20px 30px;">
        <h2 style="margin: 0;">Verify Your Email</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thanks for signing up! Please verify your email by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.NODE_ENV === "dev"? "http://localhost:3000":""}/verify-email?token=${token}" 
             style="background: #0d6efd; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${config.NODE_ENV === "dev"? "http://localhost:3000":""}/verify-email?token=${token}</p>
        <p style="margin-top: 30px;">– The FundWave Team</p>
      </div>
    </div>
  </div>
`;

export async function verifyEmail(
  name: string,
  subject: string,
  to: string,
  token: string
) {
  await transport.sendMail({
    from: `"FundWave" <${config.GOOGLE_SMTP_EMAIL}>`,
    to,
    subject,
    html: html(name, token),
  });
}
