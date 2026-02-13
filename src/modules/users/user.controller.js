import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import Task from "../tasks/task.model.js";

const addCommentHandler = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { commentText } = req.body;

  const task = await Task.findById(taskId);
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const canComment = 
    req.user.role === "admin" || 
    (task.assignedUser && task.assignedUser.toString() === req.user.id);

  if (!canComment) {
    throw new ApiError(
      403, 
      "Only amin or the assigned user can comment on this task"
    );
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $push: {
        comments: {
          commentText,
          createdBy: req.user.id,
          createdDate: new Date()
        }
      },
      $inc: { updateCounter: 1 }
    },
    { new: true }
  ).populate("comments.createdBy", "name email");

  res.status(201).json({
    success: true,
    comment: updatedTask.comments[updatedTask.comments.length - 1]
  });
});

export {addCommentHandler}