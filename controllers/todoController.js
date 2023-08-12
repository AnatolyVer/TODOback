import User from "../models/User.js"

import TodoService from '../service/todoService.js'
class todoController{
    async createTodo(req, res){
        try {
            const userId = req.query.user_id
            const todo = req.body
            await TodoService.addTodo(userId, todo, res)
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
            const oldTodoId = req.body.id;
            const newTodo = req.body;
            await TodoService.updateTodo(userId, oldTodoId, newTodo, res)
        } catch (e) {
            console.error(e);
            res.status(500).end();
        }
        return res
    }
    async mapping(req, res){
        try {
            const userId = req.query.userId
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
