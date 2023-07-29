import jwt from "jsonwebtoken";
import Verify from "../models/Verify.js";
import sendEmailConfirm from "../emailer/emailSender.js";

class EmailService{
    async sendVerification(email){
        try {
            await Verify.deleteOne({email});
            const emailToken = jwt.sign({email}, process.env.emailSecretKey)
            await Verify.create({email,emailToken})
            sendEmailConfirm(email, emailToken);
        }catch (e){
            console.log("Some problems with sending verify email")
        }
    }
}
const emailService = new EmailService()
export default emailService
