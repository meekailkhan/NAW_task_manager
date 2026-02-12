import env from "../../confing/env.js"
import User from "../users/user.model.js"
import jwt from "jsonwebtoken"

const isUserExist = async(email)=>{
    const existingUser = await User.findOne({email})
    
    return existingUser
}

const generateToken = (id,role,email) => {
  return jwt.sign({ id,role,email}, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const createUserAndToken = async(name,email,password,role)=>{
    const user = await User.create({
        email: email,
        name: name,
        password: password,
        role: role
    })

    const token = generateToken(user._id,user.role,user.email)

    return {token,user}
}


export {isUserExist,createUserAndToken}