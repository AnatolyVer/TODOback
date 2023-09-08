import ProjectService from "../service/ProjectService.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Project from "../models/Project.js";
import EmailService from "../service/EmailService.js";

class ProjectController{
    async createProject(req, res){
        try {
            const userId = req.query.user_id
            const project = req.body
            await ProjectService.createProject(userId, project, res)
        } catch (e) {
            console.error(e);
            res.status(500).end()
        }
        return res
    }

    async updateProject(req, res){
        try {
            const projectId = req.query.id
            const newProject = req.body
            await ProjectService.updateProject(projectId, newProject, res)
        } catch (e) {
            console.error(e);
            res.status(500).end();
        }
        return res
    }

    async deleteProject(req, res) {
        try {
            const userId = req.query.user_id
            const id = req.query.id
            await ProjectService.deleteProject(userId, id, res)
        } catch (err) {
            console.error(err);
            res.status(500).end();
        }
        return res
    }

    async getProjects(req, res){
        try {
            const userId = req.query.user_id
            await ProjectService.getProjects(userId, res)
        } catch (err) {
            console.error(err);
            res.status(500).end()
        }
        return res
    }

    async getInboxID(req, res){
        try {
            const userId = req.query.user_id
            await ProjectService.getInboxID(userId, res)
        } catch (err) {
            console.error(err);
            res.status(500).end()
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
            await EmailService.sendInvite(email, projectId, res)
        }catch (e) {
            console.error(e)
            res.status(500).end()
        }
        return res
    }

    async getAllMembers(req, res) {
        try {
            const {projectId} = req.query
            const project = await Project.findById(projectId)
            let users = []
            for (const member of project.members){
                const {picture, login} = await User.findById(member.id)
                users.push({picture, login, role:member.status})
            }
            res.status(200).json(users)
        }catch (e){
            console.error(e)
            res.status(500).end()
        }
        return res
    }
}
const projectController = new ProjectController()
export default projectController
