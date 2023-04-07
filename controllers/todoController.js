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
    async get_all (req, res){
        try {
            console.log("sending data...")
           res.json(todos)

        }catch (e){
            console.log(e)
        }
    }

    async create (req, res){
        const todo_to_create = req.body
        try {
            await todo.create(todo_to_create)
            res.status(200).end()
            console.log("Todo created")
        }catch (e){
            res.status(500).end()
            console.log("Error")
        }
        return res
    }
}
const TodoController = new todoController()
export default TodoController