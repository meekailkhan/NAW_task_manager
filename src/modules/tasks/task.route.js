import { Router } from "express";

const taskRouter = Router();

taskRouter.get("/",(req,res)=>{
    res.send("say hello to tasker")
})

export default taskRouter