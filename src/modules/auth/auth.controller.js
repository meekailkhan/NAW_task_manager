import env from "../../confing/env.js";
import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { createUserAndToken, isUserExist } from "./auth.service.js";
import jwt from "jsonwebtoken";

const registerHandler = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All Fields required");
  }

  const existingUser = await isUserExist(email);
  if (existingUser) {
    throw new ApiError(400, "User already exist");
  }

  const { token, user } = await createUserAndToken(name, email, password, role);
  console.log("user created successfully")
  res.status(201).json({
    success: true,
    token,
    role,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

const loginHandler = asyncHandler(async (req, res, next) => {
  console.log("execution comes here===========")
  const { email, password } = req.body;

  const user = await isUserExist(email);
  if (!user) {
    console.log("user doest not exist");
    throw new ApiError(400, "Invalid Credentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign({ id: user._id, role: user.role,email : user.email }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export { registerHandler, loginHandler };
