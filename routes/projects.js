const router = require("express").Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// Create project (admin)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Forbidden");
  }

  const project = new Project({
    name: req.body.name,
    members: req.body.members,
    createdBy: req.user.id
  });

  await project.save();
  res.json(project);
});

// Get projects
router.get("/", auth, async (req, res) => {
  const projects = await Project.find().populate("members");
  res.json(projects);
});

module.exports = router;