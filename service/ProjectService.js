import User from "../models/User.js";
import Project from "../models/Project.js";
import projectDto from "../dto/projectDto.js";

class ProjectService{
    async createProject(userId, project){
        try {
            const owner = await User.findById(userId)
            const members = [{
                id: userId,
                status: 'owner'
            }]
            const createdProject = await Project.create({...project, members})
            owner.projects.push(createdProject._id.toString())
            await owner.save()
            return new projectDto(createdProject)
        }catch (e){
            throw new Error(e.message)
        }
    }
    async addTodo(newTodo){
        try {
            const project = await Project.findById(newTodo.projectId)
            project.todos.push({...newTodo, done:false})
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

    async updateTodo(updatedTodo) {
        try {
            const project = await Project.findById(updatedTodo.projectId)
            const index = project.todos.findIndex(obj => obj.id === updatedTodo.id);
            if (index === -1) throw new Error('Todo not found')
            const oldTodo = project.todos[index]
            for (let key in updatedTodo) {
                if (updatedTodo[key] !== null && key !== "id" && key !== "projectId") {
                    oldTodo[key] = updatedTodo[key];
                }
            }
            project.todos[index] = oldTodo
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
    async getProjects(userId){
        try {
            const user = await User.findById(userId)
            const projects = []
            for (const projectId of user.projects) {
                const project = await Project.findById(projectId)
                projects.push(new projectDto(project));
            }
            return projects
        }catch (e) {
            throw new Error(e.message)
        }
    }
    async getInboxID(userId){
        try {
            const user = await User.findById(userId)
            return user.inboxID
        }catch (e) {
            throw new Error(e.message)
        }
    }

    async getProject(projectId) {
        try {
            const project = await Project.findById(projectId)
            return new projectDto(project)
        }catch (e) {
            throw new Error(e.message)
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
    async getAllMembers(projectId){
        try {
            const project = await Project.findById(projectId)
            let users = []
            for (const member of project.members){
                const {picture, login, name} = await User.findById(member.id)
                users.push({picture, login, name, role:member.status})
            }
            return users
        }catch (e) {
            throw new Error(e.message)
        }
    }

}
const projectService = new ProjectService()
export default projectService

