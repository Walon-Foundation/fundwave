import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_SMTP_EMAIL,
    pass: process.env.GOOGLE_SMTP_PASSWORD,
  },
});


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
