import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";

const userRouter = Router();

userRouter.get("/",(req,res)=>{
    res.send("say hello to user")
})

userRouter.get("/adminroute",authorizeRoles("user"),(req,res)=>{
    res.send("congrats role base auth authmiddleware works propperly")
})

export default userRouter