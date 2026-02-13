import env from "../confing/env.js";
import User from "../modules/users/user.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401,"Please provide a token");
  }
  try {
    const decode = jwt.verify(token, env.JWT_SECRET);

    req.user = {
      id: decode.id,
      role: decode.role,
      email: decode.email, // if you include it in token
    };
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid token");
    }
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Token expired");
    }
    throw err;
  }
});


export {authMiddleware}