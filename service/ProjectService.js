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
    async deleteProject(userId, projectId, res){
        try {
            const project = await Project.findById(projectId)
            if (project.owner.toString() === userId){
                const allMembers = [project.owner, ...project.members]
                for (const member of allMembers){
                    const user = await User.findById(member.toString())
                    const projectIndex = user.projects.findIndex(id => id.toString() === projectId)
                    user.projects.splice(projectIndex, 1)
                    await user.save()
                }
                await Project.deleteOne({_id: projectId})
                res.status(200).end("Deleted")
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

