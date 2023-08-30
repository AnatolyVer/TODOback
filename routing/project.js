import { Router } from "express";
import ProjectController from "../controllers/projectController.js";

const projectRouter = Router()

projectRouter.post('/create', ProjectController.createProject)
projectRouter.get('/get', ProjectController.getProject)
projectRouter.get('/get_all', ProjectController.getProjects)
projectRouter.put('/update', ProjectController.updateProject)
projectRouter.delete('/delete', ProjectController.deleteProject)
projectRouter.get('/get_inboxID', ProjectController.getInboxID)
export default projectRouter