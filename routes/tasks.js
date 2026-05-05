const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Create task
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Forbidden");
  }

  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Get tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });
  res.json(tasks);
});

// ✅ DASHBOARD MUST COME BEFORE :id
router.get("/dashboard", auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "done").length;
  const pending = tasks.filter(t => t.status !== "done").length;
  const overdue = tasks.filter(t =>
    new Date(t.dueDate) < new Date() && t.status !== "done"
  ).length;

  res.json({
    total,
    completed,
    pending,
    overdue
  });
});

// Update task
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(task);
});

module.exports = router;