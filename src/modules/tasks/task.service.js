import Task from "./task.model.js";

const createTask = async (
  title,
  description,
  priority,
  assignedUser,
  dueDate,
  createdBy,
) => {
  const task = await Task.create({
    title,
    description: description || "some task",
    priority: priority || "medium",
    assignedUser,
    dueDate,
    createdBy: createdBy,
    updateCounter: 0,
    isDeleted: false,
  });

  return task;
};

const getAllTasks = async (filter, page, limit) => {
  const tasks = await Task.find(filter)
    .populate("assignedUser", "name email")
    .populate("comments.createdBy", "name email")
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  return tasks;
};

const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: { isDeleted: true },
      $inc: { updateCounter: 1 },
    },
    { new: true },
  );
  return task
};

const deleteComment = async (taskId,commentId)=>{
  const task = await Task.findByIdAndUpdate(
      taskId,
      {
        $pull: {
          comments: { _id: commentId },
        },
        $inc: { updateCounter: 1 },
      },
      { new: true },
    );

  return task
}

export { createTask, getAllTasks, deleteTask,deleteComment };
