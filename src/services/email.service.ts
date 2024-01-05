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


export const sendEmail(from: string, to: string, subject: string, body: string): any => {
    
}