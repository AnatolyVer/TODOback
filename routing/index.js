import { Router } from "express";
import TodoController from "../controllers/todoController.js";

const router = Router()

router.get('/get_all', TodoController.get_all)
router.post('/create_todo', TodoController.create)

export default router