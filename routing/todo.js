import { Router } from "express";
import TodoController from "../controllers/todoController.js";

const todoRouter = Router()

todoRouter.post('/create', /*checkValidToken,*/ TodoController.createTodo)

todoRouter.get('/get_all', TodoController.getAllTodoByUserID)
todoRouter.put('/update', TodoController.updateTodo)
todoRouter.put('/mapping', TodoController.mapping)
todoRouter.delete('/delete', TodoController.deleteTodo)
export default todoRouter


