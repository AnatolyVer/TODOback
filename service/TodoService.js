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
    async updateTodo(userId, newTodo, res){
        try {
            const user = await User.findById(userId);
            const index = user.todos.findIndex(obj => obj.id === newTodo.id);
            if (index === -1) throw new Error('Todo not found')
            const oldTodo = user.todos[index];
            for (let key in newTodo) {
                if (newTodo[key] !== null && key !== "id") {
                    oldTodo[key] = newTodo[key];
                }
            }
            user.todos[index] = oldTodo;
            await user.save()
            res.status(200).end();
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
    async mapping(userId, todosId, method, res) {
        try {
            const user = await User.findById(userId)
            switch (method) {
                case 'delete':
                    user.todos = user.todos.filter(todo => !todosId.includes(todo.id));
                    break;
                case 'complete':
                    user.todos = user.todos.filter(todo => !todosId.includes(todo.id));
                    /*let temp = []
                    user.todos.map((todo) => {
                        if (todosId.includes(todo.id)) todo.done = true
                        temp.push(todo)
                    });
                    user.todos = temp*/
                    break;
            }
            await user.save()
            res.status(200).json(user.todos)
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
}
const todoService = new TodoService()
export default todoService

