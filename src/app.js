import express from "express";
import router from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/api",router)


app.use(errorMiddleware);

export default app;