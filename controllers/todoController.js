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
            const user = await User.findById(userId)
            if (user) {
                const method = req.query.method
                const todosId = req.body
                switch (method){
                    case 'delete':
                        user.todos = user.todos.filter(todo => !todosId.includes(todo.id));
                        break;
                    case 'complete':
                        user.todos.map(todo => {
                            if (todosId.includes(todo.id)) todo.done = true
                        });
                        break;
                }
                await user.save()
                return res.status(200).json(user.todos)
            }
            return res.status(404).end()
        } catch (e) {
            console.error(e);
            return res.status(500).end()
        }
    }
    async deleteTodo(req, res){
        try {
            const userId = req.query.user_id
            const todoId = req.query.todo_id
            console.log(typeof todoId)
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
