import { Router } from "express";
import { getMessages, postMessages } from "../controllers/chat.controller.js";


const chatRouter = Router()

chatRouter.get('/', getMessages)
chatRouter.post('/', postMessages)

export default chatRouter;
