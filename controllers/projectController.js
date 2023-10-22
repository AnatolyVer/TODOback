import ProjectService from "../service/ProjectService.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import EmailService from "../service/EmailService.js";

class ProjectController{
    async createProject(req, res){
        try {
            const userId = req.query.user_id
            const project = req.body
            const newProject = await ProjectService.createProject(userId, project)
            res.status(200).json(newProject)
        } catch (e) {
            console.error(e);
            res.status(404).end()
        }
        return res
    }

    async updateProject(req, res){
        try {
            const newProject = req.body
            await ProjectService.updateProject(newProject, res)
            res.status(200).end();
        } catch (e) {
            console.error(e);
            res.status(404).end();
        }
        return res
    }

    async deleteProject(req, res) {
        try {
            const userId = req.query.user_id
            const projectId = req.query.id
            await ProjectService.deleteProject(userId, projectId)
            res.status(200).end()
        } catch (err) {
            console.error(err);
            res.status(404).end();
        }
        return res
    }

    async getProjects(req, res){
        try {
            const userId = req.query.user_id
            const projects = await ProjectService.getProjects(userId)
            res.status(200).json(projects)
        } catch (err) {
            console.error(err);
            res.status(404).end()
        }
        return res
    }

    async getInboxID(req, res){
        try {
            const userId = req.query.user_id
            const inboxID = await ProjectService.getInboxID(userId, res)
            res.status(200).json(inboxID)
        } catch (err) {
            console.error(err);
            res.status(404).end()
        }
        return res
    }

    async sendInvite(req, res){
        try {
            const {email, regType, projectId} = req.body
            const user = await User.findOne({login: email, regType})
            const project = await Project.findById(projectId)
            user.projects.push(projectId)
            project.members.push({
                id:user._id,
                status:"member"
            })
            await user.save()
            await project.save()
            await EmailService.sendInvite(email, projectId)
        }catch (e) {
            console.error(e)
            res.status(404).end()
        }
        return res
    }

    async getAllMembers(req, res) {
        try {
            const {projectId} = req.query
            const users = await ProjectService.getAllMembers(projectId)
            res.status(200).json(users)
        }catch (e){
            console.error(e)
            res.status(404).end()
        }
        return res
    }
    async getProject(req, res) {
        try {
            const projectId = req.query.id
            const project = await ProjectService.getProject(projectId, res)
            res.status(200).json(project)
        } catch (err) {
            console.error(err);
            res.status(404).end()
        }
        return res
    }
    async addUser(req, res) {
        try {
            const {projectId, userId} = req.params

            const project = await Project.findById(projectId)
            const user = await User.findById(userId)

            user.projects.push(projectId)

            project.members.push({
                id:userId,
                status:"member"
            })
            await project.save()
            await user.save()
            res.status(200).end()
        }catch (e) {
            console.error(e)
            res.status(404).end()
        }
        return res
    }
}
const projectController = new ProjectController()
export default projectController
