import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_SMTP_EMAIL,
    pass: process.env.GOOGLE_SMTP_PASSWORD,
  },
});


// ----------------- EMAIL TEMPLATES -----------------
const templates: Record<string, (data: Record<string, string | number>) => string> = {
  "welcome": ({ name }) => `
    <div style="font-family: Arial; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #007bff;">Welcome to FundWave 🎉</h2>
      <p>Hi ${name},</p>
      <p>We’re excited to have you join our community of changemakers. Start exploring campaigns or create your own today!</p>
      <p>Thanks,<br/>The FundWave Team</p>
    </div>
  `,

  "kyc-complete": ({ name }) => `
    <div style="font-family: Arial; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #28a745;">KYC Verification Successful ✅</h2>
      <p>Hello ${name},</p>
      <p>Your KYC verification has been successfully completed. You can now create and manage campaigns without restrictions.</p>
      <p>Thanks,<br/>The FundWave Team</p>
    </div>
  `,

  "kyc-rejected": ({ name, reason }) => `
    <div style="font-family: Arial; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #cc0000;">KYC Verification Failed ❌</h2>
      <p>Hello ${name},</p>
      <p>Unfortunately, your KYC verification could not be approved.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please update your documents and try again.</p>
    </div>
  `,

  "campaign-created": ({ name, campaign }) => `
    <div style="font-family: Arial; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #007bff;">Campaign Created 🚀</h2>
      <p>Hello ${name},</p>
      <p>Your campaign <strong>${campaign}</strong> has been successfully created.</p>
      <p>Share it with your network to get more support!</p>
    </div>
  `,

  "campaign-updated": ({ name, campaign }) => `
    <div style="font-family: Arial; color: #333; max-width: 600px; margin: auto;">
      <h2>Campaign Updated ✏️</h2>
      <p>Hello ${name},</p>
      <p>Your campaign <strong>${campaign}</strong> has been updated.</p>
      <p>Log in to view the latest changes.</p>
    </div>
  `,

  "campaign-deleted": ({ name }) => `
    <div style="font-family: Arial, color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #cc0000;">Campaign Deleted 🗑️</h2>
      <p>Hello ${name},</p>
      <p>Your campaign has been successfully deleted from FundWave.</p>
    </div>
  `,

  "campaign-ended": ({ name, campaign, total }) => `
    <div style="font-family: Arial; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #ff9800;">Campaign Ended 📅</h2>
      <p>Hello ${name},</p>
      <p>Your campaign <strong>${campaign}</strong> has ended.</p>
      <p>Total Raised: <strong>$${total}</strong></p>
      <p>Thank you for being part of the FundWave community!</p>
    </div>
  `,

 "payment-complete": ({ name, amount, campaign }) => `
  <div style="font-family: Arial; color: #333; max-width: 600px; margin: auto;">
    <h2 style="color: #28a745;">Payment Successful 💳</h2>
    <p>Hi ${name},</p>
    <p>Thank you for donating <strong>$${amount}</strong> to <strong>${campaign}</strong>.</p>
    <p>Your contribution makes a difference!</p>
  </div>
`,

  "payout-sent": ({ name, amount }) => `
    <div style="font-family: Arial; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #28a745;">Payout Sent 💰</h2>
      <p>Hello ${name},</p>
      <p>We’ve sent a payout of <strong>$${amount}</strong> to your registered bank account.</p>
      <p>Thanks for trusting FundWave!</p>
    </div>
  `,
};



// ----------------- EMAIL SENDER -----------------
export async function sendEmail(
  type: keyof typeof templates,
  to: string,
  subject: string,
  data: Record<string, string | number>
) {
  const html = templates[type](data);
  await transport.sendMail({
    from: '"FundWave" <no-reply@fundwave.sl>',
    to,
    subject,
    html,
  });
}





