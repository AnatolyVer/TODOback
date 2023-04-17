import todo from "../models/Todo.js";
import todoDto from "../dto/todo_dto.js";


class todoController{

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
            const transformedDocs = [];
            for (const doc of docs) {
                const transformedDoc = new todoDto(doc)
                transformedDocs.push(transformedDoc)
            }
            docs.sort((a, b) => a.priority.localeCompare(b.priority));
            return res.status(200).json(transformedDocs);
        } catch (e) {
            console.log(e);
            return res.status(500).end();
        }
    }

    async createTodo(req, res){
        const { user_id, label, description, priority, date, done, id } = req.body;
        const _id = id;
        try {
            await todo.create({user_id, label, description, priority, date, done, _id})
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