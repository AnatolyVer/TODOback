import User from "../models/User.js";

class todoController{

    async deleteTodo(req, res){
        try {
            const user_id = req.query.user_id
            const todo_id = req.query.todo_id
            const found = await User.findById(user_id)
            if (!found) {
                return res.status(404).send('Запись не найдена')
            }
            const index = found.todos.findIndex(obj => obj._id === +todo_id);
            found.todos.splice(index, 1);
            await found.save()
            return res.status(200).send('Запись успешно удалена')
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    }

    async updateTodo(req, res){
        try {
            const user_id = req.query.user_id;
            const id = req.body.id; // предположим, что id тудушки передан в параметрах запроса
            const user = await User.findById(user_id);
            if (!user) {
                return res.status(404).end();
            }
            const index = user.todos.findIndex(obj => obj.id === id);
            if (index === -1) {
                return res.status(404).end();
            }
            const oldTodo = user.todos[index];
            const newTodo = req.body;
            for (let key in oldTodo) {
                if (newTodo[key] === null && key !== "id") {
                    newTodo[key] = oldTodo[key];
                }
            }
            user.todos[index] = newTodo;
            await user.save();
            return res.status(200).end();
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }

    }
    async getAllTodoByUserID(req, res) {
        try {
            const user_id = req.params.user_id;
            const user = await User.findById(user_id);
            if (user){
                user.todos.sort((a, b) => a.priority.localeCompare(b.priority));
                return res.status(200).json(user.todos);
            }
            return res.status(404).end();
        } catch (e) {
            console.log(e);
            return res.status(500).end();
        }
    }

    async createTodo(req, res){
        try {
            const { id, label, description, priority, date, done} = req.body;
            const user_id = req.query.user_id
            const found = await User.findById(user_id)
            const todos = found.todos
            console.log(todos)
            found.todos.push({id, label, description, priority, date, done})
            await found.save()
            res.status(200).end()
            console.log("Todo created")
        }catch (e){
            res.status(500).end()
            console.log(e)
        }
        return res
    }
}
const TodoController = new todoController()
export default TodoController
