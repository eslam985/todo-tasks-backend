const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  addNewTask,
  editTask,
  changesTaskStatus,
  deleteTask,
  deleteAllTasks,
} = require("../../../controllers/tasksController.js");

router.route("/").get(getAllTasks).post(addNewTask);

router.route("/delete-all").delete(deleteAllTasks);


router.route("/:id/complete").patch(changesTaskStatus);
router.route("/:id").put(editTask).delete(deleteTask);

module.exports = router;
