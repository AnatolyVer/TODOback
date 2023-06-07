import { Router } from "express";
import TodoController from "../controllers/todoController.js";
import UserController from "../controllers/userController.js";

const router = Router()


/*-------------------------- Todo -------------------------*/

router.get('/get_all/:user_id', TodoController.getAllTodoByUserID)
router.get('/get_tags', UserController.getTags)

router.post('/create_todo', /*checkValidToken,*/ TodoController.createTodo)
router.post('/add_tag', UserController.addTag)

router.delete('/delete', TodoController.deleteTodo)
router.delete('/delete_tag', UserController.addTag)

router.put('/update', TodoController.updateTodo)
router.put('/update_tag', UserController.updateTag)

/*-------------------------- User -------------------------*/

router.post('/auth', UserController.auth)
router.post('/sign_up', UserController.signUp)


export default router