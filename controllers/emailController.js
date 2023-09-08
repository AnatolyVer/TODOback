
import User from "../models/User.js";

import EmailService from "../service/EmailService.js";

class EmailController{
    async confirmEmail(req, res){
        try {
            const emailToken = req.body.emailToken;
            await EmailService.confirmEmail(emailToken, res)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async resendEmail(req, res){
        try {
            const {login} = req.query;
            await EmailService.sendVerification(login)
            res.status(200).end()
        } catch (err) {
            console.error(err);
            res.status(500).end()
        }
        return res
    }

    async sendEmailVerifiedStatus(req, res){
        try {
            const {user_id} = req.query;
            await EmailService.sendEmailVerifiedStatus(user_id, res)
        } catch (err) {
            console.error(err);
            res.status(500).end()
        }
        return res
    }
}
const emailController = new EmailController()
export default emailController
