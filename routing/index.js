import { Router } from "express";
import TodoController from "../controllers/todoController.js";
import UserController from "../controllers/userController.js";

const router = Router()

/*-------------------------- Todo -------------------------*/

router.get('/get_all/:user_id', TodoController.getAllTodoByUserID)
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

/*-------------------------- User -------------------------*/

router.post('/auth', UserController.auth)
router.post('/sign_up', UserController.signUp)


export default router