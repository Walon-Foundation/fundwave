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
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e7ff; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #f8faff);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #2563eb; margin-bottom: 15px; font-size: 24px;">Welcome to FundWave 🎉</h2>
        <div style="background-color: #dbeafe; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; color: #1e40af; font-weight: 500;">Your journey to making a difference starts now!</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">We're absolutely thrilled to welcome you to our community of changemakers! At FundWave, we believe in the power of collective action to create real change.</p>
      
      <div style="background-color: #f1f5f9; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Get Started:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">✨ Explore campaigns that inspire you</li>
          <li style="margin-bottom: 8px;">🚀 Create your own campaign in minutes</li>
          <li style="margin-bottom: 8px;">🤝 Connect with like-minded supporters</li>
          <li>📊 Track your impact in real-time</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Our team is here to support you every step of the way. If you have any questions or need guidance, don't hesitate to reach out.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Ready to make waves?</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,

  "kyc-complete": ({ name }) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #d1fae5; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #f0fdf4);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #059669; margin-bottom: 15px; font-size: 24px;">KYC Verification Successful ✅</h2>
        <div style="background-color: #dcfce7; padding: 16px; border-radius: 8px; border-left: 4px solid #059669;">
          <p style="margin: 0; color: #065f46; font-weight: 500;">Your account is now fully verified!</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Great news! Your KYC verification has been successfully completed and approved by our team.</p>
      
      <div style="background-color: #f0fdf4; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">What's Next?</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">🎯 Create unlimited campaigns without restrictions</li>
          <li style="margin-bottom: 8px;">💸 Receive donations and process payouts seamlessly</li>
          <li style="margin-bottom: 8px;">📈 Access advanced campaign analytics</li>
          <li>🔒 Enhanced security features for your account</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Your verified status helps build trust with donors and ensures a smooth experience for all your fundraising activities.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1fae5;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Thank you for completing the verification process.</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,

  "kyc-rejected": ({ name, reason }) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fecaca; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #fef2f2);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #dc2626; margin-bottom: 15px; font-size: 24px;">KYC Verification Requires Attention ❌</h2>
        <div style="background-color: #fee2e2; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #b91c1c; font-weight: 500;">Additional information needed</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">We've reviewed your KYC submission, but unfortunately we couldn't approve it at this time. Don't worry - this is usually easy to fix!</p>
      
      <div style="background-color: #fef2f2; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Reason for Review:</h3>
        <div style="background-color: white; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444;">
          <p style="margin: 0; color: #dc2626; font-weight: 500;">${reason}</p>
        </div>
      </div>
      
      <div style="background-color: #fffbeb; padding: 18px; border-radius: 8px; margin: 25px 0; border: 1px solid #fcd34d;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">How to Resolve:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">📷 Ensure documents are clear and fully visible</li>
          <li style="margin-bottom: 8px;">📄 Check that all information matches your official documents</li>
          <li style="margin-bottom: 8px;">🔄 Resubmit your documents through your account dashboard</li>
          <li>⏰ Typically processed within 24-48 hours after resubmission</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">If you need assistance or have questions about the requirements, our support team is here to help.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #fecaca;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">We're here to help you get verified quickly.</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,

  "campaign-created": ({ name, campaign }) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #c7d2fe; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #f0f9ff);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #4f46e5; margin-bottom: 15px; font-size: 24px;">Campaign Successfully Launched! 🚀</h2>
        <div style="background-color: #e0e7ff; padding: 16px; border-radius: 8px; border-left: 4px solid #4f46e5;">
          <p style="margin: 0; color: #3730a3; font-weight: 500;">Your campaign is now live and accepting donations</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Congratulations <strong>${name}</strong>!</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Your campaign <strong style="color: #4f46e5;">${campaign}</strong> has been successfully created and is now live on FundWave.</p>
      
      <div style="background-color: #e0f2fe; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Next Steps to Success:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">📣 Share your campaign across social media platforms</li>
          <li style="margin-bottom: 8px;">✉️ Send personalized emails to friends and family</li>
          <li style="margin-bottom: 8px;">🔄 Post regular updates to keep supporters engaged</li>
          <li>🙏 Thank donors promptly to build relationships</li>
        </ul>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 18px; border-radius: 8px; margin: 25px 0; border: 1px solid #bae6fd;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Pro Tips:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Set up campaign notifications to stay informed</li>
          <li style="margin-bottom: 8px;">Use high-quality images and compelling stories</li>
          <li style="margin-bottom: 8px;">Set realistic milestones and celebrate achievements</li>
          <li>Respond to comments and questions quickly</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">You can track your campaign's performance, manage donations, and post updates directly from your dashboard.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #c7d2fe;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Wishing you tremendous success with your campaign!</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,

  "campaign-updated": ({ name, campaign }) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #bae6fd; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #f0f9ff);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #0ea5e9; margin-bottom: 15px; font-size: 24px;">Campaign Updated Successfully ✏️</h2>
        <div style="background-color: #e0f2fe; padding: 16px; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0; color: #0369a1; font-weight: 500;">Your changes have been saved</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Your campaign <strong style="color: #0ea5e9;">${campaign}</strong> has been successfully updated with the latest changes.</p>
      
      <div style="background-color: #f0f9ff; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">What's New:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">All modifications have been applied successfully</li>
          <li style="margin-bottom: 8px;">Supporters will see the updated information immediately</li>
          <li style="margin-bottom: 8px;">Campaign performance tracking continues uninterrupted</li>
          <li>Donation processing remains active throughout updates</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Keeping your campaign information fresh and engaging helps maintain donor interest and can boost your fundraising results.</p>
      
      <div style="background-color: #e0f2fe; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <p style="margin: 0; color: #0369a1; font-weight: 500;">💡 Tip: Consider sharing an update with your supporters about the changes you've made to keep them informed and engaged!</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #bae6fd;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Happy fundraising!</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,

  "campaign-deleted": ({ name }) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fecaca; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #fef2f2);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #dc2626; margin-bottom: 15px; font-size: 24px;">Campaign Successfully Deleted 🗑️</h2>
        <div style="background-color: #fee2e2; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #b91c1c; font-weight: 500;">Campaign removed from FundWave</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Your campaign has been successfully deleted from FundWave as requested.</p>
      
      <div style="background-color: #fef2f2; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">What This Means:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">The campaign is no longer visible to the public</li>
          <li style="margin-bottom: 8px;">All campaign data has been permanently removed</li>
          <li style="margin-bottom: 8px;">Any ongoing donations have been stopped</li>
          <li>Supporters will no longer see this campaign in their lists</li>
        </ul>
      </div>
      
      <div style="background-color: #fffbeb; padding: 18px; border-radius: 8px; margin: 25px 0; border: 1px solid #fcd34d;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Future Opportunities:</h3>
        <p style="margin: 0; color: #92400e;">Remember, you can always create a new campaign when you're ready. Each campaign is a new opportunity to make a difference!</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #fecaca;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Thank you for being part of our community.</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,

  "campaign-ended": ({ name, campaign, total }) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fed7aa; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #fff7ed);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #ea580c; margin-bottom: 15px; font-size: 24px;">Campaign Successfully Completed 📅</h2>
        <div style="background-color: #ffedd5; padding: 16px; border-radius: 8px; border-left: 4px solid #ea580c;">
          <p style="margin: 0; color: #9a3412; font-weight: 500;">Your fundraising journey has reached its conclusion</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Your campaign <strong style="color: #ea580c;">${campaign}</strong> has officially ended. Thank you for your dedication and hard work throughout this fundraising journey.</p>
      
      <div style="background-color: #ffedd5; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Campaign Summary:</h3>
        <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px; border-radius: 8px; margin-bottom: 12px;">
          <span style="font-weight: 500;">Total Funds Raised:</span>
          <span style="font-size: 18px; font-weight: bold; color: #ea580c;">SLE${total}</span>
        </div>
        <p style="margin: 0; color: #9a3412;">Every contribution, no matter the size, has made a meaningful impact.</p>
      </div>
      
      <div style="background-color: #fef3c7; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Next Steps:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">🎉 Celebrate your achievement with your supporters</li>
          <li style="margin-bottom: 8px;">✍️ Send a final thank-you message to all donors</li>
          <li style="margin-bottom: 8px;">📊 Review your campaign analytics for insights</li>
          <li>🌟 Consider sharing your success story for future campaigns</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Your campaign dashboard will remain accessible for 30 days for your reference, after which it will be archived.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #fed7aa;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Thank you for choosing FundWave for your fundraising journey.</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,

  "payment-complete": ({ name, amount, campaign }) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #bbf7d0; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #f0fdf4);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #16a34a; margin-bottom: 15px; font-size: 24px;">Donation Successfully Processed 💳</h2>
        <div style="background-color: #dcfce7; padding: 16px; border-radius: 8px; border-left: 4px solid #16a34a;">
          <p style="margin: 0; color: #166534; font-weight: 500;">Thank you for your generous support!</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Your donation of <strong style="color: #16a34a;">SLE${amount}</strong> to <strong style="color: #2563eb;">${campaign}</strong> has been successfully processed and is now on its way to making a difference.</p>
      
      <div style="background-color: #f0fdf4; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Donation Details:</h3>
        <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Amount:</span>
            <span style="font-weight: bold; color: #16a34a;">SLE${amount}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Campaign:</span>
            <span style="font-weight: 500; color: #2563eb;">${campaign}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: 500;">Date:</span>
            <span style="color: #6b7280;">${new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div style="background-color: #dcfce7; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Your Impact:</h3>
        <p style="margin: 0; color: #166534;">Your contribution directly supports the cause and helps create positive change. Donors like you make it possible for important work to continue.</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">A receipt for your donation has been generated and is available in your account dashboard for your records.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #bbf7d0;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">With gratitude for your generosity,</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,

  "payout-sent": ({ name, amount }) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #86efac; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #f0fdf4);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #16a34a; margin-bottom: 15px; font-size: 24px;">Payout Successfully Processed 💰</h2>
        <div style="background-color: #dcfce7; padding: 16px; border-radius: 8px; border-left: 4px solid #16a34a;">
          <p style="margin: 0; color: #166534; font-weight: 500;">Funds are on the way to your account!</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Great news! We've successfully processed your payout request of <strong style="color: #16a34a;">$${amount}</strong> from your FundWave account.</p>
      
      <div style="background-color: #f0fdf4; padding: 18px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Payout Details:</h3>
        <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #86efac;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Amount:</span>
            <span style="font-weight: bold; color: #16a34a;">$${amount}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="font-weight: 500;">Status:</span>
            <span style="color: #16a34a; font-weight: 500;">Processing</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="font-weight: 500;">Estimated Arrival:</span>
            <span style="color: #6b7280;">3-5 business days</span>
          </div>
        </div>
      </div>
      
      <div style="background-color: #fffbeb; padding: 18px; border-radius: 8px; margin: 25px 0; border: 1px solid #fcd34d;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Important Information:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Processing times may vary depending on your bank</li>
          <li style="margin-bottom: 8px;">You'll receive another notification when funds are deposited</li>
          <li style="margin-bottom: 8px;">Check your bank statement for the transaction details</li>
          <li>Contact support if you don't see the funds after 5 business days</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Thank you for using FundWave for your fundraising needs. We're honored to support your important work.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #86efac;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Wishing you continued success with your initiatives.</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,

  "account-deleted": ({ name, email }) => `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fecaca; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #fef2f2);">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #dc2626; margin-bottom: 15px; font-size: 24px;">Account Successfully Deleted 🗑️</h2>
        <div style="background-color: #fee2e2; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626;">
          <p style="margin: 0; color: #b91c1c; font-weight: 500;">We're sorry to see you go</p>
        </div>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6;">Hello ${name},</p>
      
      <p style="font-size: 16px; line-height: 1.6;">Your FundWave account (<strong>${email}</strong>) has been successfully deleted as requested.</p>
      
      <div style="background-color: #fef2f2; padding: 18px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #555; margin-top: 0; margin-bottom: 12px;">What this means:</h3>
        <ul style="margin-bottom: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">All your personal information has been permanently removed from our systems</li>
          <li style="margin-bottom: 8px;">Any active campaigns you created have been deactivated</li>
          <li style="margin-bottom: 8px;">You will no longer receive communications from FundWave</li>
          <li>All account access has been permanently revoked</li>
        </ul>
      </div>
      
      <div style="background-color: #fffbeb; padding: 18px; border-radius: 8px; margin: 25px 0; border: 1px solid #fcd34d;">
        <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Future Considerations:</h3>
        <p style="margin: 0; color: #92400e;">If this was a mistake or you change your mind, you can create a new account anytime using a different email address. We're constantly improving based on feedback from users like you.</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #666;">We appreciate the time you spent with us and hope you found value in our platform.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #fecaca;">
        <p style="font-size: 14px; color: #6b7280; margin-bottom: 5px;">Thank you for having been part of the FundWave community.</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
      </div>
    </div>
  `,
  
  "account-updated": ({ name, changes, timestamp }) => `
  <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #c7d2fe; border-radius: 12px; background: linear-gradient(to bottom, #ffffff, #f0f9ff);">
    <div style="text-align: center; margin-bottom: 25px;">
      <h2 style="color: #4f46e5; margin-bottom: 15px; font-size: 24px;">Account Updated Successfully ✅</h2>
      <div style="background-color: #e0e7ff; padding: 16px; border-radius: 8px; border-left: 4px solid #4f46e5;">
        <p style="margin: 0; color: #3730a3; font-weight: 500;">Your account information has been updated</p>
      </div>
    </div>
    
    <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
    
    <p style="font-size: 16px; line-height: 1.6;">Your FundWave account was successfully updated on <strong>${new Date(timestamp).toLocaleString()}</strong>. Below are the changes that were made:</p>
    
    <div style="background-color: #f0f9ff; padding: 18px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Changes Made:</h3>
      <div style="background-color: white; padding: 15px; border-radius: 6px; border-left: 4px solid #4f46e5;">
        <p style="margin: 0; color: #4f46e5; font-weight: 500;">${changes}</p>
      </div>
    </div>
    
    <div style="background-color: #e0f2fe; padding: 18px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #374151; margin-top: 0; margin-bottom: 12px;">Security Note:</h3>
      <ul style="margin-bottom: 0; padding-left: 20px;">
        <li style="margin-bottom: 8px;">If you made these changes, no further action is needed</li>
        <li style="margin-bottom: 8px;">If you didn't make these changes, please secure your account immediately</li>
        <li style="margin-bottom: 8px;">Consider changing your password and enabling two-factor authentication</li>
        <li>Contact support if you notice any suspicious activity</li>
      </ul>
    </div>
    
    <p style="font-size: 16px; line-height: 1.6;">Keeping your account information up to date helps ensure the security of your campaigns and donations.</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #c7d2fe;">
      <p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">Thank you for keeping your account information current.</p>
      <p style="font-size: 14px; color: #6b7280; margin: 0;">The FundWave Team</p>
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