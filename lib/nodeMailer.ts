import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_SMTP_EMAIL,
    pass: process.env.GOOGLE_SMTP_PASSWORD,
  },
});

const confirmEmail = (name: string, token: string) => `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 40px; color: #333;">
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div style="background: #0d6efd; color: white; padding: 20px 30px;">
        <h2 style="margin: 0;">Verify Your Email</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thanks for signing up! Please verify your email by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NODE_ENV === "development"? "http://localhost:3000/api/auth":""}/verify-email?token=${token}" 
             style="background: #0d6efd; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${process.env.NODE_ENV === "development"? "http://localhost:3000":""}/verify-email?token=${token}</p>
        <p style="margin-top: 30px;">– The FundWave Team</p>
      </div>
    </div>
  </div>
`;

const getForgotPasswordEmail = (name: string, resetLink: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
    <h2 style="color: #0066cc;">Hello ${name},</h2>
    <p>You recently requested to reset your password. Click the button below to proceed:</p>
    
    <p style="text-align: center;">
      <a href="${resetLink}" style="
        background-color: #0066cc;
        color: #fff;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        margin: 20px 0;
      ">Reset Password</a>
    </p>

    <p>If you didn't request this, please ignore this email. Your password won't be changed unless you access the link above and create a new one.</p>

    <p style="margin-top: 30px;">Thanks,<br/>The FundWave Team</p>
    
    <hr style="margin-top: 40px;" />
    <p style="font-size: 12px; color: #777;">This link will expire in 15 minutes. If you need help, contact support at support@fundwave.sl</p>
  </div>
`

export const getCampaignDeletedEmail = (name: string) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
    <h2 style="color: #cc0000;">Hello ${name},</h2>
    
    <p>We wanted to let you know that your campaign has been successfully deleted from the FundWave platform.</p>
    
    <p>If you did not perform this action or believe it was a mistake, please contact our support team immediately.</p>

    <p style="margin-top: 30px;">Thanks,<br/>The FundWave Team</p>

    <hr style="margin-top: 40px;" />
    <p style="font-size: 12px; color: #777;">Need help? Reach out to us at <a href="mailto:support@fundwave.sl">support@fundwave.sl</a>.</p>
  </div>
`


export async function verifyEmail(
  name: string,
  subject: string,
  to: string,
  token: string
) {
  await transport.sendMail({
    from: `"FundWave" <${process.env.GOOGLE_SMTP_EMAIL}>`,
    to,
    subject,
    html: confirmEmail(name, token),
  });
}

export async function ForgotPasswordEmail(
  email:string,
  resetLink:string
){
  await transport.sendMail({
    from: '"FundWave" <no-reply@fundwave.sl>',
    to: email,
    subject: "Reset Your FundWave Password",
    html: getForgotPasswordEmail(email, resetLink),
  })
}



export async function deletedCampaignEmail(
  email:string,
  name:string,
){
  await transport.sendMail({
    from: '"Fundwavesl" <no-reply@fundwavesl@gmail.com>',
    to:email,
    subject:"Campaign Deleted",
    html:getCampaignDeletedEmail(name),
  })
}
