import User from "../models/User.js"

import TodoService from '../service/TodoService.js'
import ProjectService from "../service/ProjectService.js";
import Project from "../models/Project.js";
class todoController{
    async createTodo(req, res){
        try {
            const userId = req.query.user_id
            const todo = req.body
            const user = await User.findById(userId)
            if (todo.projectId === user.inboxID)
                await TodoService.addTodo(user, todo)
            else
                await ProjectService.addTodo(todo.projectId, todo)
        }catch (e){
            console.error(e)
            res.status(500).end()
        }
        return res
    }
    async getAllTodoByUserID(req, res) {
        try {
            const userId = req.query.user_id
            await TodoService.getSortedTodos(userId, res)
        } catch (e) {
            console.error(e)
            res.status(500).end()
        }
        return res
    }
    async updateTodo(req, res){
        try {
            const userId = req.query.user_id;
            const newTodo = req.body;
            const user = await User.findById(userId);
            if (newTodo.projectId === user.inboxID) await TodoService.updateTodo(userId, newTodo)
            else await ProjectService.updateTodo()
            res.status(200).end();
        } catch (e) {
            console.error(e);
            res.status(404).end();
        }
        return res
    }
    async mapping(req, res){
        try {
            const userId = req.query.user_id
            const method = req.query.method
            const todosId = req.body
            await TodoService.mapping(userId, todosId, method, res)
        } catch (e) {
            console.error(e);
            res.status(500).end()
        }
        return res
    }
    async deleteTodo(req, res){
        try {
            const userId = req.query.user_id
            const todoId = req.query.todo_id
            await TodoService.deleteTodo(userId, todoId, res)
        } catch (e) {
            console.error(e)
            res.status(500).end()
        }
        return res
    }
}
const TodoController = new todoController()
export default TodoController
