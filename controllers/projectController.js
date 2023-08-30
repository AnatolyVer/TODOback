import ProjectService from "../service/ProjectService.js";
import User from "../models/User.js";

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
            const userId = req.query.user_id
            const newProject = req.body
            await ProjectService.updateProject(userId, newProject, res)
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

    async getProject(req, res){
        try {
            const projectId = req.query.projectId
            await ProjectService.getProject(projectId, res)
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
}
const projectController = new ProjectController()
export default projectController
