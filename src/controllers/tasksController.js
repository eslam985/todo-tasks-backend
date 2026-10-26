const Task = require("../model/Task.js");
const mongoose = require("mongoose");

const getAllTasks = async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (currentPage - 1) * limit;

    const [tasks, totalTasks] = await Promise.all([
      Task.find({ userId: req.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Task.countDocuments({ userId: req.userId }),
    ]);

    res.status(200).json({
      success: true,
      message: `found ${totalTasks} Task(s)`,
      data: tasks,
      pagination: {
        total: totalTasks,
        page: currentPage,
        limit: limit,
        totalPage: Math.ceil(totalTasks / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const addNewTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Task title required" });

    const result = await Task.create({
      title: title,
      description: description || null,
      userId: req.userId,
    });

    res.status(201).json({
      success: true,
      message: `Added Task ${result.title} successfully!`,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const editTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "taskId is required" });

    const foundTask = await Task.findOne({
      _id: id,
      userId: req.userId,
    }).exec();

    if (!foundTask)
      return res.status(403).json({ success: false, message: `Forbidden` });

    if (title) foundTask.title = title;
    if (description) foundTask.description = description;

    const result = await foundTask.save();

    res.status(200).json({
      success: true,
      message: `Updated Task ${result.title} successfully!`,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "taskId is required" });

    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Task ID structure" });

    const foundTask = await Task.findOne({
      _id: id,
      userId: req.userId,
    }).exec();

    if (!foundTask)
      return res.status(403).json({ success: false, message: `Forbidden` });

    await foundTask.deleteOne();
    res.status(200).json({ success: true, message: `Task ${id} deleted` });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const changesTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "taskId is required" });

    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid Task ID structure" });

    const { status } = req.body;

    if (!["pending", "completed"].includes(status) || !status)
      return res.status(400).json({
        success: false,
        message: "status most be pending or completed",
      });

    const foundTask = await Task.findOne({
      _id: id,
      userId: req.userId,
    }).exec();

    if (!foundTask)
      return res.status(403).json({ success: false, message: `Forbidden` });

    foundTask.status = status;

    const result = await foundTask.save();

    res.status(200).json({
      success: true,
      message: `change Task status ${result.status} successfully!`,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const deleteAllTasks = async (req, res) => {
  try {
    const result = await Task.deleteMany({ userId: req.userId });

    res.status(200).json({
      success: true,
      message: `deleted ${result.deletedCount} Tsak(s) successfully!`,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

module.exports = {
  getAllTasks,
  addNewTask,
  editTask,
  deleteTask,
  changesTaskStatus,
  deleteAllTasks,
};
