import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    // service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export default transporter;





// it is for second option of sending mail to user  
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default resend;