import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.SMTP.SMTP_EMAIL, 
        pass: config.SMTP.SMTP_PASSWORD,
    }
});


const confirmationEmail = async (to: string, token: string) => {
    const confirmationLink = config.NODE_ENV === "development" ? `http://${config.HOST}:${config.PORT}/users/confirm-email?token=${token}` : `${config.HOST}/users/confirm-email?token=${token}`;

    const emailContent = `
    <p>Please click on the following link to confirm your email:</p>
    <a href="${confirmationLink}">${confirmationLink}</a>
  `;

    await transporter.sendMail({
        from: config.SMTP.SMTP_EMAIL, // sender address
        to, // list of receivers
        subject: "Confirm Your Email  ✔", // Subject line
        text: `please click on the following link to confirm you email ${confirmationLink}`, // plain text body 
        html: emailContent, // HTML version of the email
    });
};

export default {
    confirmationEmail,
};