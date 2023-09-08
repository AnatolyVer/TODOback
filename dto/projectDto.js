class projectDto{
    id
    name
    members
    color
    isPinned
    todos
    constructor(project) {
        this.id = project._id
        this.name = project.name
        this.members = project.members
        this.color = project.color
        this.isPinned = project.isPinned
        this.todos = project.todos
    }
}

export default projectDto