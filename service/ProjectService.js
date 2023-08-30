import User from "../models/User.js";
import Project from "../models/Project.js";
class ProjectService{
    async createProject(userId, project, res){
        try {
            const owner = await User.findById(userId)
            const createdProject = await Project.create({...project, owner,})
            owner.projects.push(createdProject._id)
            await owner.save()
            res.status(200).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
    async updateProject(userId, newProject, res){
        try {
            const user = await User.findById(userId)
            const index = user.projects.findIndex(obj => obj.id === newProject.id)
            const oldProject = user.projects[index];
            for (let key in newProject) {
                if (newProject[key] !== null && key !== "id") {
                    oldProject[key] = newProject[key];
                }
            }
            user.projects[index] = oldProject;
            await user.save()
            res.status(200).end()
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
    }
    async deleteProject(userId, id, res){
        try {
            const user = await User.findById(userId)
            const tagIndex = user.projects.findIndex(obj => obj.id === id)
            user.projects.splice(tagIndex, 1)
            user.todos = user.todos.filter(obj => obj.projectId !== id)
            await user.save()
            res.status(200).json(user.todos)
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
                projects.push(projectObject);
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
}
const projectService = new ProjectService()
export default projectService

