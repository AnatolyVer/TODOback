
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
            return res.status(200).end()
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }

    async sendEmailVerifiedStatus(req, res){
        try {
            const {login} = req.query;
            const user = await User.findOne({login})
            return res.status(200).json(user.emailIsVerified)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }
}
const emailController = new EmailController()
export default emailController
