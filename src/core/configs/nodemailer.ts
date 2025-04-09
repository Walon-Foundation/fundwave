import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized:false
    }
});

export const sendVerificationEmail = async(email:string, link:string) =>{
    const htmlContent = `
    <h1>Verify your email: </h1>
    <a href="${link}>${link}</a>
    `
    try{
        await transporter.sendMail({
            from:`"Fundwavesl 💌" <${process.env.EMAIL}>`,
            to:email,
            subject:"Verify your email",
            html:htmlContent,
            headers:{
                'X-MyApp': "Verify email",
                'X-Priority': '1'
            }
        })
    }catch(error){
        console.error(error)
    }
}