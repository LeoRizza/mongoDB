import { Router } from "express";
import { getUser, getUserById, putUser, deleteUser } from "../controllers/users.controller.js";

const userRouter = Router()

userRouter.get('/', getUser)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', putUser)
userRouter.delete('/:id', deleteUser)

export default userRouter