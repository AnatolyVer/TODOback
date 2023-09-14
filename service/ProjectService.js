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
    async updateProject(newProject, res){
        try {
            const project = await Project.findById(newProject.id)
            for (let key in newProject) {
                if (newProject[key] !== null && key !== "id") {
                    project[key] = newProject[key];
                }
            }
            await project.save()
            res.status(200).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
    async deleteProject(userId, projectId, res){
        try {
            const project = await Project.findById(projectId)
            const todos = project.todos
            if (project.members[0].id === userId){
                for (const member of project.members){
                    const user = await User.findById(member.id)
                    const projectIndex = user.projects.findIndex(id => id === projectId)
                    user.projects.splice(projectIndex, 1)
                    await user.save()
                }
                await project.delete()
                res.status(200).json(todos)
            }
            res.status(404).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
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
}
const projectService = new ProjectService()
export default projectService

