import { Router } from "express";
import { loginHandler, registerHandler } from "./auth.controller.js";

const authRouter = Router();

authRouter.get("/",(req,res)=>{
    res.send("say hello from authorizer")
})

authRouter.post("/register",registerHandler)
authRouter.post("/login",loginHandler)

export default authRouter