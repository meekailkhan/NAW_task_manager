import { Router } from "express";
import userRouter from "../modules/users/user.route.js";
import taskRouter from "../modules/tasks/task.route.js";

const router = Router()

router.get('/hello',(req,res)=>{
    res.send("say hello world")
})

router.use("/user",userRouter)
router.use("/task",taskRouter)

export default router