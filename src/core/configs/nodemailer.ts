import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendVerificationEmail = async (email: string, link: string, username:string) => {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hello ${username ?? "There"},</h2>
            <p>Thank you for signing up! Please click the button below to verify your email address:</p>
            <a href="${link}" 
               style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
               Verify Email
            </a>
            <p>If the button doesn't work, copy and paste the following link into your browser:</p>
            <p>${link}</p>
            <br>
            <p>– The Fundwavesl Team</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Fundwavesl 💌" <${process.env.EMAIL}>`,
            to: email,
            subject: "Please Verify Your Email Address ✅",
            html: htmlContent,
            headers: {
                'X-MyApp': "Verify email",
                'X-Priority': '1',
                'Precedence': 'bulk'
            }
        });
    } catch (error) {
        console.error("Email send failed:", error);
    }
};
