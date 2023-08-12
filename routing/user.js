import { Router } from "express";
import TodoController from "../controllers/todoController.js";
import UserController from "../controllers/userController.js";

const userRouter = Router()

import multer from 'multer'
const upload = multer();

/*-------------------------- Todo -------------------------*/

router.get('/get_all', TodoController.getAllTodoByUserID)
router.get('/get_tags', UserController.getTags)
router.get('/get_favorites', UserController.getFavorites)
router.get('/get_inboxID', UserController.getInboxID)
router.get('/get_projects', UserController.getProjects)
router.get('/get_project', UserController.getProject)


router.post('/create_todo', /*checkValidToken,*/ TodoController.createTodo)
router.post('/add_tag', UserController.addTag)
router.post('/add_favorite', UserController.addFavorite)
router.post('/add_project', UserController.addProject)

router.delete('/delete', TodoController.deleteTodo)
router.delete('/delete_tag', UserController.deleteTag)
router.delete('/delete_favorite', UserController.deleteFavorite)
router.delete('/delete_project', UserController.deleteProject)


router.put('/update', TodoController.updateTodo)
router.put('/update_tag', UserController.updateTag)
router.put('/update_project', UserController.updateProject)
router.put('/mapping', TodoController.mapping)


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