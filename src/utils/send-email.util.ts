import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import { accountVerifyTemplate } from "../templates/emailVerification.template";
import { SendEmailType } from "../types/email.type";


let transporter: any;

const transporterInit = () => {
    // Define the nodemailer transporter
    transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        secureConnection: false,
        port: 465,
        auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
        rejectUnauthorized: true,
        },
    } as SMTPTransport.Options);
};


export const sendUserAccountVerificationEmail = async ({
    emailTo,
    subject,
    otp,
    firstName,
  }: SendEmailType) => {
    // Init the nodemailer transporter
    transporterInit();
  
    try {
      let response = await transporter.sendMail({
        from: "Theraswift",
        to: emailTo,
        subject: subject,
        html: accountVerifyTemplate(otp, firstName!),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };


