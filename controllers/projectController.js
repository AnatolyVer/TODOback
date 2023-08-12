import ProjectService from "../service/ProjectService.js";
import User from "../models/User.js";

class ProjectController{
    async addProject(req, res){
        try {
            const userId = req.query.user_id
            const project = req.body
            await ProjectService.addProject(userId, project, res)
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
            const userId = req.query.user_id
            const id = req.query.id
            await ProjectService.getProject(userId, id, res)
        } catch (err) {
            console.error(err);
            res.status(500).end()
        }
        return res
    }

    async getInboxID(req, res){
        try {
            const user_id = req.query.user_id
            const user = await User.findById(user_id)
            if (!user) {
                return res.status(404).end()
            }
            if (!(user.inboxID.length)){
                user.inboxID = Date.now().toString()
                await user.save()
            }
            return res.status(200).json(user.inboxID)
        } catch (err) {
            console.error(err);
            return res.status(500).end()
        }
    }
}
const projectController = new ProjectController()
export default projectController
