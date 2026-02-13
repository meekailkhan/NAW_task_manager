import { Router } from "express";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import {
    bulkUpdateHandler,
  getTaskByIdHandler,
  getTaskHandler,
  partialUpdateHandler,
  reassignTaskHandler,
  removeCommentHandler,
  softDeleteHandler,
  taskCreateHandler,
  updateFullTaskHandler,
  updateStatusHandler,
} from "./task.controller.js";

const taskRouter = Router();

taskRouter.get("/", (req, res) => {
  res.send("say hello to tasker");
});

taskRouter.post("/create", authorizeRoles("admin"), taskCreateHandler);

taskRouter.get("/get-all", getTaskHandler);
taskRouter.get("/getTask/:id", getTaskByIdHandler);

taskRouter.patch(
  "/update/:taskId",
  authorizeRoles("admin"),
  updateFullTaskHandler,
);

taskRouter.delete(
  "/comment/:taskId/:commentId",
  authorizeRoles("admin"),
  removeCommentHandler,
);

taskRouter.patch("/delete/:taskId", authorizeRoles("admin"), softDeleteHandler);

taskRouter.patch(
  "/update/status/:taskId",
  authorizeRoles("admin"),
  updateStatusHandler,
);

taskRouter.patch(
  "/reassign/:taskId",
  authorizeRoles("admin"),
  reassignTaskHandler,
);

taskRouter.patch("/update/partial/:taskId",authorizeRoles("admin"),partialUpdateHandler)
taskRouter.patch("/bulk/update",authorizeRoles("admin"),bulkUpdateHandler)



export default taskRouter;
