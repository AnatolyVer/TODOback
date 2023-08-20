import { Router } from "express";
import UserController from "../controllers/userController.js";

const userRouter = Router()

import multer from 'multer'
import EmailController from "../controllers/emailController.js";
const upload = multer();

userRouter.post('/auth', UserController.auth)
userRouter.post('/sign_up', UserController.signUp)
userRouter.post('/set_avatar', upload.single('image'), UserController.setAvatar)

userRouter.get('/get_verification_status', EmailController.sendEmailVerifiedStatus)
userRouter.post('/confirm_email', EmailController.confirmEmail)
userRouter.post('/resend_email', EmailController.resendEmail)

export default userRouter