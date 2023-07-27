// emailSender.js
import nodemailer from 'nodemailer'
import html from '../emailer/htmlForEmail.js'

import { config } from "dotenv";
config();

const emailConfig = {
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
};

const transporter = nodemailer.createTransport(emailConfig);

function sendEmailConfirm(to, token) {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: "Email Verification",
        html:html(to, token)
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export default sendEmailConfirm;
