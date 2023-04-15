import { Router } from "express";
import TodoController from "../controllers/todoController.js";

const router = Router()

router.get('/get_all', TodoController.getAllTodo)
router.get('/get_all/:user_id', TodoController.getAllTodoByUserID)

router.post('/create_todo', TodoController.createTodo)

router.delete('/delete/:id', TodoController.deleteTodo)

router.put('/update/:id', TodoController.updateTodo)

export default router