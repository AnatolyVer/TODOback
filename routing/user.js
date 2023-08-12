import { Router } from "express";
import UserController from "../controllers/userController.js";

const userRouter = Router()

import multer from 'multer'
const upload = multer();

userRouter.post('/auth', UserController.auth)
userRouter.post('/sign_up', UserController.signUp)
userRouter.get('/get_avatar', UserController.getAvatar)
userRouter.get('/get_verification_status', UserController.sendEmailVerifiedStatus)
userRouter.get('/get_inboxID', UserController.getInboxID)


/*
userRouter.post('/confirm_email', UserController.confirmEmail)
userRouter.post('/resend_email', UserController.resendEmail)
*/


router.post('/set_avatar', upload.single('image'), UserController.setAvatar)


export default userRouter