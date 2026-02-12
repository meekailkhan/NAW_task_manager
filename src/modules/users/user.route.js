import { Router } from "express";

const userRouter = Router();

userRouter.get("/",(req,res)=>{
    res.send("say hello to user")
})

export default userRouter