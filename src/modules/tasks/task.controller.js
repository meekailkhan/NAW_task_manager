import ApiError from "../../utils/apiError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import Task from "./task.model.js";
import {
  createTask,
  deleteComment,
  deleteTask,
  getAllTasks,
} from "./task.service.js";

const taskCreateHandler = asyncHandler(async (req, res, next) => {
  const { title, description, priority, assignedUser, dueDate } = req.body;
  const task = await createTask(
    title,
    description,
    priority,
    assignedUser,
    dueDate,
    req.user.id,
  );

  if (task.assignedUser) {
    await task.populate("assignedUser", "name email");
  }
  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

const getTaskHandler = asyncHandler(async (req, res, next) => {
  const { status, priority, assignedUser, page = 1, limit = 10 } = req.query;

  const filter = { isDeleted: false };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedUser) filter.assignedUser = assignedUser;

  const tasks = await getAllTasks(filter, page, limit);

  const total = await Task.countDocuments(filter);

  res.status(200).json({
    success: true,
    tasks,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getTaskByIdHandler = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const task = await Task.findOne({
    _id: id,
    isDeleted: false,
  })
    .populate("assignedUser")
    .populate("createdBy")
    .populate("comments.createdBy", "name email");

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  res.status(200).json({
    success: true,
    task,
  });
});

const softDeleteHandler = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  if (taskId.length !== 24) {
    throw new ApiError(400, "task id invalid id must be 24 characters");
  }

  const task = await deleteTask(taskId);

  console.log("delete task is ==>", task);
  res.status(200).json({
    success: true,
    message: "Task moved to trash",
  });
});

const removeCommentHandler = asyncHandler(async (req, res, next) => {
  const { taskId, commentId } = req.params;

  if (taskId.length !== 24) {
    throw new ApiError(400, "task id invalid id must be 24 characters");
  }

  const task = await deleteComment(taskId, commentId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  res.status(200).json({
    success: true,
    message: "Comment removed successfully",
  });
});

const updateStatusHandler = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (taskId.length !== 24) {
    throw new ApiError(400, "task id invalid id must be 24 characters");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found check task id");
  }

  const validTransitions = {
    pending: ["in-progress"],
    "in-progress": ["completed", "pending"],
    completed: ["in-progress"],
  };

  if (!validTransitions[task.status]?.includes(status)) {
    throw new ApiError(
      400,
      `Cannot transition from ${task.status} to ${status}`,
    );
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: { status },
      $inc: { updateCounter: 1 },
    },
    { new: true },
  );

  res.status(200).json({ success: true, task: updatedTask });
});

const reassignTaskHandler = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const { assignedUser } = req.body;

  if (!assignedUser) {
    throw new ApiError(400, "user id require to assing that user");
  }

  if (taskId.length !== 24) {
    throw new ApiError(400, "task id invalid id must be 24 characters");
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: { assignedUser },
      $inc: { updateCounter: 1 },
    },
    { new: true },
  ).populate("assignedUser", "name email");

  res.status(200).json({ success: true, task });
});

const updateFullTaskHandler = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const { title, description, priority, dueDate } = req.body;

  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        title,
        description,
        priority,
        dueDate,
      },
      $inc: { updateCounter: 1 },
    },
    { new: true, runValidators: true },
  );

  res.status(200).json({ success: true, task });
});

const partialUpdateHandler = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const updates = req.body;

  const allowedFields = ["priority", "dueDate", "description"];
  const updateField = Object.keys(updates)[0];

  if (!allowedFields.includes(updateField)) {
    throw new ApiError(400, `Cannot update ${updateField} via partial update`);
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: updates,
      $inc: { updateCounter: 1 },
    },
    { new: true },
  );

  res.status(200).json({ success: true, task });
});

const bulkUpdateHandler = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const result = await Task.updateMany(
    {
      status: { $ne: "completed" },
      isDeleted: false,
    },
    {
      $set: { status },
      $inc: { updateCounter: 1 },
    },
  );
  console.log("result of bulk update", result);

  res.status(200).json({
    success: true,
    message: `Updated ${result.modifiedCount} overdue tasks`,
  });
});

export {
  taskCreateHandler,
  getTaskHandler,
  softDeleteHandler,
  removeCommentHandler,
  updateStatusHandler,
  reassignTaskHandler,
  updateFullTaskHandler,
  partialUpdateHandler,
  bulkUpdateHandler,
  getTaskByIdHandler,
};
