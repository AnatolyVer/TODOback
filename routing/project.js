import { Router } from "express";
import ProjectController from "../controllers/projectController.js";

const projectRouter = Router()

projectRouter.get('/get_inboxID', ProjectController.getInboxID)
projectRouter.get('/get_all', ProjectController.getProjects)

projectRouter.get('/get_all_members', ProjectController.getAllMembers)


projectRouter.post('/create', ProjectController.createProject)

projectRouter.post('/send_invite', ProjectController.sendInvite)


projectRouter.put('/update', ProjectController.updateProject)
projectRouter.delete('/delete', ProjectController.deleteProject)
export default projectRouter