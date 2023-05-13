import { Router } from "express";
import TodoController from "../controllers/todoController.js";
import UserController from "../controllers/userController.js";

const router = Router()


/*-------------------------- Todo -------------------------*/

router.get('/get_all/:user_id', TodoController.getAllTodoByUserID)

router.post('/create_todo', /*checkValidToken,*/ TodoController.createTodo)
router.post('/add_tag', UserController.addTag)

router.delete('/delete', TodoController.deleteTodo)

router.put('/update', TodoController.updateTodo)

/*-------------------------- User -------------------------*/

router.post('/auth', UserController.auth)
router.post('/sign_up', UserController.signUp)


export default router