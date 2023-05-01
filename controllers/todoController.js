import todoDto from "../dto/todo_dto.js";
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
            const index = found.todos.findIndex(obj => obj._id === todo_id);
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
            const user_id  = req.query.user_id
            const { id, label, description, priority, date, done} = req.body;
            const user = await User.findById(user_id);
            if (!user) {
                return res.status(404).end();
            }
            const index = user.todos.findIndex(obj => obj._id === id);
            user.todos[index] = { _id:id, label, description, priority, date, done}
            user.save()
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
            const transformedDocs = [];
            for (const todo of user.todos) {
                const transformedDoc = new todoDto(todo)
                transformedDocs.push(transformedDoc)
            }
            transformedDocs.sort((a, b) => a.priority.localeCompare(b.priority));
            return res.status(200).json(transformedDocs);
        } catch (e) {
            console.log(e);
            return res.status(500).end();
        }
    }

    async createTodo(req, res){
        try {
            const { id, label, description, priority, date, done} = req.body;
            const user_id = req.query.user_id
            const todo_id = id
            const found = await User.findById(user_id)
            const todos = found.todos
            console.log(todos)
            found.todos.push({label, description, priority, date, done, _id:todo_id})
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
