import { Router } from "express";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { addCommentHandler } from "./user.controller.js";

const userRouter = Router();

userRouter.get("/",(req,res)=>{
    res.send("say hello to user")
})

userRouter.get("/adminroute",authorizeRoles("admin"),(req,res)=>{
    res.send("hello world this route only admin can access")
})

userRouter.post("/comment/create/:taskId",addCommentHandler)


export default userRouter