import jwt from "jsonwebtoken";

import Verify from "../models/Verify.js";

import User from "../models/User.js";
import nodemailer from "nodemailer";
import { config } from "dotenv";
config();


class EmailService{

    #emailConfig = {
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    };

    #transporter = nodemailer.createTransport(this.#emailConfig);

    #htmlConfirmEmail = (to, token) => {
        return (
            '<h1>Hello there!</h1>' +
            '<p>You received this letter because you are using the best life management service ever! You just need to verificate your email by clicking this link</p>' +
            '<p>Just ignore it, if you doesn&#39;t even know about us(((</p>' +
            '<a href=\'http://localhost:5173/email_verification?token=' + token + '\'>Click me!</a>'
        )
    }
    #htmlSendInvite = (to, projectId) => {
        return (
            '<h1>Hello there!</h1>' +
            '<p>You received this letter because you were invited to a project</p>' +
            '<p>Just ignore it, if you doesn&#39;t even know about us(((</p>' +
            '<a href=\'http://localhost:5173/join_project/' + projectId + '\'>Click me!</a>'
        )
    }

    async sendVerification(email){
        try {
            await Verify.deleteOne({email});
            const emailToken = jwt.sign({email}, process.env.EMAIL_SECRET_KEY)
            await Verify.create({email, emailToken})
            this.#sendEmail(email, this.#htmlConfirmEmail(email, emailToken), "Email Verification");
        }catch (e){
            throw new Error(e)
        }
    }

    async sendInvite(email, projectId , res){
        try {
            this.#sendEmail(email, this.#htmlSendInvite(projectId), "Project Invite");
            res.status(200).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
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

    async sendEmailVerifiedStatus(userId, res){
        try {
            const user = await User.findById(userId)
            res.status(200).json(user.emailIsVerified)
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }

    #sendEmail(to, html, subject) {
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            html
        };

        this.#transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
const emailService = new EmailService()
export default emailService
