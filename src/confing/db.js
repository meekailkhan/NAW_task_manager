import mongoose from "mongoose";
import env from "./env.js";

export const connectDB = async () => {
  try {
    (async () => {
      await mongoose.connect(env.MONGO_URI);
      console.log("db connected successfully");
    })();
  } catch (err) {
    console.error("DB connection failed:", err.message);
  }
};
