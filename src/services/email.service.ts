import nodemailer from "nodemailer";
import config from "../config/config";

const transporter = nodemailer.createTransport({
    host: config.SMTP.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.SMTP.SMTP_EMAIL, 
        pass: config.SMTP.SMTP_PASSWORD, // generated ethereal password
    },
});


export const sendConfirmationEmail = async (to: string, token: string) => {
    const confirmationLink = config.NODE_ENV === "development" ? `http://${config.HOST}:${config.PORT}/user/confirm-email?token=${token}` : `${config.HOST}/user/confirm-email?token=${token}`;

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