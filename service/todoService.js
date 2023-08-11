class TodoServise{
    async addTodo(user, todo){
        try {
            user.todos.push({...todo, done:false})
            await user.save()
        }catch (e){
            console.error(e)
        }
    }

    async sortTodos(user){
        try {
            user.todos.sort((a, b) => a.priority.localeCompare(b.priority))
            await user.save()
        }catch (e) {
            console.error(e)
        }
    }

    async updateTodo(user, index, newTodo){
        try {
            const oldTodo = user.todos[index];
            for (let key in newTodo) {
                if (newTodo[key] !== null && key !== "id") {
                    oldTodo[key] = newTodo[key];
                }
            }
            user.todos[index] = oldTodo;
            await user.save();
        }catch (e) {
            console.error(e)
        }
    }
}

const todoServise = new TodoServise()
export default todoServise