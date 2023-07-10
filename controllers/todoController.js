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
            const index = found.todos.findIndex(obj => obj.id === +todo_id);

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
            const id = req.body.id;
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
            for (let key in newTodo) {
                if (newTodo[key] !== null && key !== "id") {
                    oldTodo[key] = newTodo[key];
                }
            }
            user.todos[index] = oldTodo;
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
                await user.save()
                return res.status(200).json(user.todos);
            }
            return res.status(404).end();
        } catch (e) {
            console.log(e);
            return res.status(500).end()
        }
    }

    async createTodo(req, res){
        try {
           /* const accessToken = req.headers['authorization'].split(' ')[1]
            const refreshToken = req.cookies.refreshToken

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }*/
            const { id, label, description, priority, date, done, tags, projectId} = req.body;
            const user_id = req.query.user_id
            const found = await User.findById(user_id)
            const todos = found.todos
            todos.push({id, label, description, priority, date, done, tags, projectId})
            await found.save()
            res.status(200).end()
            console.log("Todo created")
        }catch (e){
            res.status(500).end()
            console.log(e)
        }
    }

    async mapping(req, res){
        try {
            const user_id = req.query.user_id
            const method = req.query.method
            const todosID = req.body
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            switch (method){
                case 'delete':
                    user.todos = user.todos.filter(todo => !todosID.includes(todo.id));
                    break;
                case 'complete':
                    user.todos = user.todos.map(todo => {
                        if (todosID.includes(todo.id)) todo.done = true
                    });
                    break;
            }
            await user.save()
            return res.status(200).json(user.todos)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }


}
const TodoController = new todoController()
export default TodoController
