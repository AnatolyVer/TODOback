import { Router } from "express";
import TodoController from "../controllers/todoController.js";
import UserController from "../controllers/userController.js";

const userRouter = Router()

import multer from 'multer'
const upload = multer();

/*-------------------------- Todo -------------------------*/

router.get('/get_inboxID', UserController.getInboxID)
router.get('/get_projects', UserController.getProjects)
router.get('/get_project', UserController.getProject)


router.post('/add_project', UserController.addProject)


router.delete('/delete_project', UserController.deleteProject)


router.put('/update_project', UserController.updateProject)


/*-------------------------- User -------------------------*/

/*
router.get('/checkTokenValid', checkValidToken, UserController.checkTokenValid)*/

userRouter.post('/auth', UserController.auth)
userRouter.post('/sign_up', UserController.signUp)
userRouter.get('/get_avatar', UserController.getAvatar)
userRouter.get('/get_verification_status', UserController.sendEmailVerifiedStatus)

/*
userRouter.post('/confirm_email', UserController.confirmEmail)
userRouter.post('/resend_email', UserController.resendEmail)
*/


router.post('/set_avatar', upload.single('image'), UserController.setAvatar)


export default userRouter