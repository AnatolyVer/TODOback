class projectDto{
    id
    name
    members
    color
    isPinned
    todos
    shared
    constructor(project) {
        this.id = project._id
        this.name = project.name
        this.members = project.members
        this.color = project.color
        this.isPinned = project.isPinned
        this.todos = project.todos
        this.shared = project.shared

    }
}

export default projectDto