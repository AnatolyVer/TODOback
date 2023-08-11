import User from "../models/User.js"

import TodoService from '../service/todoService.js'
class todoController{
    async createTodo(req, res){
        try {
            const userId = req.query.user_id
            const user = await User.findById(userId)
            if (user){
                const todo = req.body
                await TodoService.addTodo(user, todo)
                res.status(200).end()
            }
        }catch (e){
            console.error(e)
            res.status(500).end()
        }
    }
    async getAllTodoByUserID(req, res) {
        try {
            const userId = req.query.user_id
            const user = await User.findById(userId)
            if (user){
                await TodoService.sortTodos(user)
                return res.status(200).json(user.todos)
            }
            return res.status(404).end()
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    }
    async updateTodo(req, res){
        try {
            const userId = req.query.user_id;
            const user = await User.findById(userId);
            if (user) {
                const todoId = req.body.id;
                const index = user.todos.findIndex(obj => obj.id === todoId);
                if (index !== -1) {
                    const newTodo = req.body;
                    await TodoService.updateTodo(user, index, newTodo)
                    return res.status(200).end();
                }
            }
            return res.status(404).end();
        } catch (e) {
            console.error(e);
            return res.status(500).end();
        }
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
            const user = await User.findById(userId)
            if (user) {
                const todoId = req.query.todo_id
                const index = user.todos.findIndex(obj => obj.id === +todoId);
                user.todos.splice(index, 1);
                await user.save()
                return res.status(200).end()
            }
            return res.status(404).end()
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    }
}
const TodoController = new todoController()
export default TodoController
