import { Router } from "express";
import TodoController from "../controllers/todoController.js";

const router = Router()

router.get('/get_all', TodoController.get_all)

export default router