import jwt from "jsonwebtoken";

import Verify from "../models/Verify.js";

import User from "../models/User.js";
import nodemailer from "nodemailer";
import { config } from "dotenv";
config();


class EmailService{

    emailConfig = {
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    };

    transporter = nodemailer.createTransport(this.emailConfig);

    html = (to, token) => {
        return (
            '<h1>Hello there!</h1>' +
            '<p>Hi there! You received this letter because you are using the best life management service ever! You just need to verificate your email by clicking this link</p>' +
            '<p>Just ignore it, if you doesn&#39;t even know about us(((</p>' +
            '<a href=\'http://localhost:5173/email_verification?token=' + token + '\'>Click me!</a>'
        )
    }
    async sendVerification(email){
        try {
            await Verify.deleteOne({email});
            const emailToken = jwt.sign({email}, process.env.EMAIL_SECRET_KEY)
            await Verify.create({email, emailToken})
            this.#sendEmailConfirm(email, emailToken);
        }catch (e){
            throw new Error(e)
        }
    }
    async confirmEmail(emailToken, res){
        try {
            const record = await Verify.findOne({emailToken})

            await jwt.verify(emailToken, process.env.EMAIL_SECRET_KEY)

            await Verify.deleteOne({emailToken});
            const user = await User.findOne({login: record.email, regType:'password'})
            user.emailIsVerified = true
            await user.save()
            res.status(200).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }

    #sendEmailConfirm(to, token) {
        const mailOptions = {
            from: process.env.EMAIL,
            to: to,
            subject: "Email Verification",
            html:this.html(to, token)
        };

        this.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    async sendEmailVerifiedStatus(login, res){
        try {
            const user = await User.findOne({login, regType: 'password'})
            res.status(200).json(user.emailIsVerified)
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }

}
const emailService = new EmailService()
export default emailService
