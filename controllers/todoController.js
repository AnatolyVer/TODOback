import todo from "../models/Todo.js";

const todos = [
    {
        user_id:"1234",
    label:"Test label",
    id:"1",
    description:"Description 1",
    done:"false",
    priority:"Priority level 1",
    date: "1.01.2024"
},
    {
        label:"Test label",
        id:"2",
        description:"Description 2",
        done:"false",
        priority:"Priority level 2",
        date: "1.01.2024"
    },
    {
        label:"Test label",
        id:"3",
        description:"Description 3",
        done:"true",
        priority:"Priority level 3",
        date: "1.01.2024"
    },
    {
        label:"Test label",
        id:"4",
        description:"Description 4",
        done:"true",
        priority:"Priority level 4",
        date: "1.01.2024"
    }
    ]

class todoController{
    async getAllTodo(req, res){
        try {
            console.log("sending data...")
           res.json(todos)

        }catch (e){
            console.log(e)
        }
    }

    async deleteTodo(req, res){
        try {
            const _id = req.params.id
            const found = await todo.findByIdAndDelete(_id)
            if (!found) {
                return res.status(404).send('Запись не найдена')
            }
            return res.status(200).send('Запись успешно удалена')
        } catch (e) {
            console.error(e)
            return res.status(500).end()
        }
    }


    async updateTodo(req, res){
        try {
            const { id } = req.params;
            const { user_id, label, description, priority, date, done } = req.body;
            const updatedTodo = await todo.findByIdAndUpdate(id, { user_id, label, description, priority, date, done }, { new: true });
            if (!updatedTodo) {
                return res.status(404).end();
            }
            return res.status(200).end();
        } catch (err) {
            console.error(err);
            return res.status(500).end();
        }
    }
    async getAllTodoByUserID(req, res) {
        try {
            const user_id = req.params.user_id;
            const docs = await todo.find({ user_id });
            docs.sort((a, b) => a.priority.localeCompare(b.priority));
            return res.status(200).json(docs);
        } catch (e) {
            console.log(e);
            return res.status(500).end();
        }
    }

    async createTodo(req, res){
        const todo_to_create = req.body
        try {
            await todo.create(todo_to_create)
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