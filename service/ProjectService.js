import User from "../models/User.js";
import Project from "../models/Project.js";
import projectDto from "../dto/projectDto.js";

class ProjectService{
    async createProject(userId, project, res){
        try {
            const owner = await User.findById(userId)
            const members = [{
                id: userId,
                status: 'owner'
            }]
            const createdProject = await Project.create({...project, members})
            owner.projects.push(createdProject._id.toString())
            await owner.save()
            res.status(200).json(new projectDto(createdProject))
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
    async addTodo(projectId, todo){
        try {
            const project = await Project.findById(todo.projectId)
            project.todos.push({...todo, done:false})
            await project.save()
        }catch (e) {
            throw new Error(e.message)
        }
    }

    async deleteTodo(projectId, todoId){
        try {
            const project = await Project.findById(projectId)
            project.todos = project.todos.filter(obj => obj.id !== todoId);
            await project.save()
        }catch (e) {
            console.error(e)
        }
    }

    async updateTodo(projectId, newTodo) {
        try {
            const project = await Project.findById(newTodo.projectId)
            const oldTodo = project.todos.filter(obj => obj.id === newTodo.id);
            if (oldTodo) throw new Error('Todo not found')
            for (let key in newTodo) {
                if (newTodo[key] !== null && key !== "id") {
                    oldTodo[key] = newTodo[key];
                }
            }
            await project.save()
        }catch (e) {
            throw new Error(e.message)
        }
    }

    async updateProject(newProject){
        try {
            const project = await Project.findById(newProject.id)
            for (let key in newProject) {
                if (newProject[key] !== null && key !== "id") {
                    project[key] = newProject[key];
                }
            }
            await project.save()
        }catch (e){
            throw new Error(e.message)
        }
    }
    async deleteProject(userId, projectId){
        try {
            const project = await Project.findById(projectId)
            if (project.members[0].id === userId){
                for (const member of project.members){
                    const user = await User.findById(member.id)
                    user.projects = user.projects.filter(id => id !== projectId)
                    await user.save()
                }
                await project.delete()
            }
            throw new Error("No rights")
        }catch (e){
            throw new Error(e.message)
        }
    }
    async getProjects(userId, res){
        try {
            const user = await User.findById(userId)
            const projects = []
            for (const projectId of user.projects) {
                const project = await Project.findById(projectId)
                const projectObject = project.toObject();
                delete projectObject.__v;
                projects.push(new projectDto(projectObject));
            }
            res.status(200).json(projects)
        }catch (e) {
            console.error(e)
            res.status(404).end()
        }
    }
    async getInboxID(userId, res){
        try {
            const user = await User.findById(userId)
            res.status(200).json(user.inboxID)
        }catch (e) {
            console.error(e)
            res.status(404).end()
        }
    }

    async getProject(projectId, res) {
        try {
            const project = await Project.findById(projectId)
            res.status(200).json(new projectDto(project))
        }catch (e) {
            console.error(e)
            res.status(404).end()
        }
    }

    async getUserProjectsID(userID){
        try {
            const user = await User.findById(userID)
            return user.projects
        }catch (e){
            console.error(e)
        }
    }
}
const projectService = new ProjectService()
export default projectService

