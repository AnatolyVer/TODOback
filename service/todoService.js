import User from "../models/User.js";

class TodoService{
    async addTodo(userId, todo, res){
        try {
            const user = await User.findById(userId)
            user.todos.push({...todo, done:false})
            await user.save()
            res.status(200).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
    async getSortedTodos(userId, res){
        try {
            const user = await User.findById(userId)
            user.todos.sort((a, b) => a.priority.localeCompare(b.priority))
            await user.save()
            res.status(200).json(user.todos)
        }catch (e) {
            console.error(e)
            res.status(404).end()
        }
    }
    async updateTodo(userId, oldTodoId, newTodo, res){
        try {
            const user = await User.findById(userId);
            const index = user.todos.findIndex(obj => obj.id === todoId);
            if (index !== -1){
                const oldTodo = user.todos[index];
                for (let key in newTodo) {
                    if (newTodo[key] !== null && key !== "id") {
                        oldTodo[key] = newTodo[key];
                    }
                }
                user.todos[index] = oldTodo;
                await user.save()
                res.status(200).end();
            }
        }catch (e) {
            console.error(e)
            res.status(404).end();
        }
    }
    async deleteTodo(userId, todoId, res){
        try {
            const user = await User.findById(userId)
            const index = user.todos.findIndex(obj => obj.id === +todoId);
            if (index === -1) throw new Error("Todo not found");
            user.todos.splice(index, 1);
            await user.save()
            res.status(200).end();
        }catch (e) {
            console.error(e)
            res.status(404).end();
        }
    }
}

const todoService = new TodoService()
export default todoService

