import { Router } from "express";

import TagController from "../controllers/tagController.js";

const tagRouter = Router()

tagRouter.post('/add', TagController.addTag)
tagRouter.get('/get', TagController.getTags)
tagRouter.put('/update', TagController.updateTag)
tagRouter.delete('/delete', TagController.deleteTag)
export default tagRouter