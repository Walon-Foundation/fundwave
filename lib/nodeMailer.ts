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
  
  "account-deleted": ({ name, email }) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #cc0000; margin-bottom: 10px;">Account Successfully Deleted 🗑️</h2>
      <div style="background-color: #ffebee; padding: 15px; border-radius: 6px; border-left: 4px solid #cc0000;">
        <p style="margin: 0; color: #b71c1c;">We're sorry to see you go</p>
      </div>
    </div>
    
    <p>Hello ${name},</p>
    
    <p>Your FundWave account (<strong>${email}</strong>) has been successfully deleted as requested.</p>
    
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <h3 style="color: #555; margin-top: 0;">What this means:</h3>
      <ul style="margin-bottom: 0;">
        <li>All your personal information has been permanently removed from our systems</li>
        <li>Any active campaigns you created have been deactivated</li>
        <li>You will no longer receive communications from FundWave</li>
      </ul>
    </div>
    
    <p style="color: #666;">If this was a mistake or you changed your mind, you can create a new account anytime using a different email address.</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 14px; color: #999; margin-bottom: 5px;">Thank you for having been part of the FundWave community.</p>
      <p style="font-size: 14px; color: #999; margin: 0;">The FundWave Team</p>
    </div>
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





