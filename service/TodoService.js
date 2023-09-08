import User from "../models/User.js";
import Project from "../models/Project.js";

class TodoService{

    //done for project-changes
    async addTodo(userId, todo, res){
        try {
            const user = await User.findById(userId)
            if (todo.projectId === user.inboxID){
                user.todos.push({...todo, done:false})
                await user.save()
            }
            else{
                const project = await Project.findById(todo.projectId)
                project.todos.push({...todo, done:false})
                await project.save()
            }
            res.status(200).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
    async getSortedTodos(userId, res){
        try {
            const user = await User.findById(userId)
            let todos = [...user.todos]

            for (const project of user.projects){
                const curProject = await Project.findById(project)
                todos = [...todos, ...curProject.todos]
            }

            todos.sort((a, b) => a.priority.localeCompare(b.priority))
            res.status(200).json(todos)
        }catch (e) {
            console.error(e)
            res.status(404).end()
        }
    }
    async updateTodo(userId, newTodo, res){
        try {
            const user = await User.findById(userId);
            if (newTodo.projectId === user.inboxID){
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
            }
            else {
                const project = await Project.findById(newTodo.projectId)
                const index = project.todos.findIndex(obj => obj.id === newTodo.id);
                if (index === -1) throw new Error('Todo not found')
                const oldTodo = project.todos[index];
                for (let key in newTodo) {
                    if (newTodo[key] !== null && key !== "id") {
                        oldTodo[key] = newTodo[key];
                    }
                }
                project.todos[index] = oldTodo;
                await project.save()
            }
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
                    const temp = user.todos.map(todo => {
                        if (todosId.includes(todo.id)) todo.done = true;
                        return todo
                    });
                    user.todos = []
                    await user.save()
                    user.todos = temp
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

