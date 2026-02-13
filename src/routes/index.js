import { Router } from "express";
import userRouter from "../modules/users/user.route.js";
import taskRouter from "../modules/tasks/task.route.js";
import authRouter from "../modules/auth/auth.router.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/hello',(req,res)=>{
    res.send("say hello world")
})

router.use("/auth",authRouter)
router.use("/user",authMiddleware,userRouter)
router.use("/task",authMiddleware,taskRouter)


export default router