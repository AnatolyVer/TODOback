import { Router } from "express";
import ProjectController from "../controllers/projectController.js";

const projectRouter = Router()

projectRouter.get('/get_inboxID', ProjectController.getInboxID)
projectRouter.get('/get', ProjectController.getProject)
projectRouter.get('/get_all', ProjectController.getProjects)
projectRouter.post('/create', ProjectController.createProject)
projectRouter.put('/update', ProjectController.updateProject)
projectRouter.delete('/delete', ProjectController.deleteProject)
export default projectRouter