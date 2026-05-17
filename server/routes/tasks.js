const router = require("express").Router();

const Task = require("../models/Task");
const User = require("../models/User");
const auth = require("../middleware/auth");

function normalizeLegacyTask(task) {
  const status =
    task.status ||
    (task.type === "saving"
      ? "completed"
      : task.type === "expense"
        ? "pending"
        : "pending");

  return {
    _id: task._id,
    userId: task.userId,
    workspaceId: task.workspaceId || task.userId,
    title: task.title,
    notes: task.notes || "",
    category: task.category || "General",
    priority: task.priority || "medium",
    status,
    dueDate: task.dueDate || null,
    completedAt: task.completedAt || null,
    date: task.date,
    updatedAt: task.updatedAt || task.date,
    createdBy: {
      id: task.userId || "",
      name: task.createdByName || "Unknown",
      email: task.createdByEmail || "",
    },
    assignedTo: task.assignedToId
      ? {
          id: task.assignedToId,
          name: task.assignedToName || "Unknown",
          email: task.assignedToEmail || "",
        }
      : null,
    isOverdue:
      Boolean(task.dueDate) &&
      status !== "completed" &&
      new Date(task.dueDate).getTime() < Date.now(),
  };
}

function normalizeDueDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function loadCurrentUser(userId) {
  return User.findById(userId).select("_id name email workspaceId role adminUserId");
}

async function loadWorkspaceMembers(workspaceId) {
  return User.find({ workspaceId }).select("_id name email workspaceId").sort({ name: 1 });
}

function buildMemberMap(members) {
  return new Map(members.map((member) => [String(member._id), member]));
}

function buildTaskPayload(body, existingTask, currentUser, memberMap) {
  const title = String(body.title || existingTask?.title || "").trim();
  const notes =
    body.notes !== undefined
      ? String(body.notes || "").trim()
      : String(existingTask?.notes || "").trim();
  const category = String(body.category || existingTask?.category || "General").trim() || "General";
  const priority = ["low", "medium", "high"].includes(body.priority)
    ? body.priority
    : existingTask?.priority || "medium";
  const status = ["pending", "in-progress", "completed"].includes(body.status)
    ? body.status
    : existingTask?.status || "pending";
  const dueDate = normalizeDueDate(body.dueDate ?? existingTask?.dueDate ?? null);
  const assignedToId =
    currentUser.role === "admin" && body.assignedToId !== undefined
      ? String(body.assignedToId || "").trim()
      : String(existingTask?.assignedTo?.id || "");

  if (!title) {
    return { error: "Task title is required" };
  }

  let assignedMember = null;

  if (assignedToId) {
    assignedMember = memberMap.get(assignedToId);

    if (!assignedMember) {
      return { error: "Assigned member is not part of this workspace" };
    }
  }

  return {
    workspaceId: currentUser.workspaceId || String(currentUser._id),
    title,
    notes,
    category,
    priority,
    status,
    dueDate,
    createdByName: existingTask?.createdBy?.name || currentUser.name,
    createdByEmail: existingTask?.createdBy?.email || currentUser.email,
    assignedToId: assignedMember ? String(assignedMember._id) : "",
    assignedToName: assignedMember ? assignedMember.name : "",
    assignedToEmail: assignedMember ? assignedMember.email : "",
    completedAt: status === "completed" ? existingTask?.completedAt || new Date() : null,
    updatedAt: new Date(),
  };
}

router.post("/", auth, async (req, res) => {
  try {
    const currentUser = await loadCurrentUser(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create tasks" });
    }

    const members = await loadWorkspaceMembers(currentUser.workspaceId || String(currentUser._id));
    const payload = buildTaskPayload(req.body, null, currentUser, buildMemberMap(members));

    if (payload.error) {
      return res.status(400).json({ message: payload.error });
    }

    const task = await Task.create({
      ...payload,
      userId: String(currentUser._id),
    });

    res.status(201).json(normalizeLegacyTask(task));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const currentUser = await loadCurrentUser(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const workspaceId = currentUser.workspaceId || String(currentUser._id);
    const isAdmin = currentUser.role === "admin";
    const data = await Task.find(
      isAdmin
        ? {
            $or: [
              { workspaceId },
              {
                userId: req.user.id,
                $or: [{ workspaceId: "" }, { workspaceId: { $exists: false } }],
              },
            ],
          }
        : {
            $or: [
              {
                assignedToId: String(currentUser._id),
                workspaceId,
              },
              {
                assignedToId: String(currentUser._id),
                $or: [{ workspaceId: "" }, { workspaceId: { $exists: false } }],
              },
            ],
          }
    ).sort({ date: -1 });

    const normalized = data.map((task) => {
      if (!task.workspaceId) {
        task.workspaceId = workspaceId;
      }

      if (!task.createdByName) {
        task.createdByName = currentUser.name;
        task.createdByEmail = currentUser.email;
      }

      return normalizeLegacyTask(task);
    });

    res.json(normalized);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const currentUser = await loadCurrentUser(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const workspaceId = currentUser.workspaceId || String(currentUser._id);
    const task = await Task.findOne({
      _id: req.params.id,
      $or:
        currentUser.role === "admin"
          ? [{ workspaceId }, { userId: req.user.id }]
          : [{ assignedToId: String(currentUser._id), workspaceId }],
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const members = await loadWorkspaceMembers(workspaceId);
    const normalizedTask = normalizeLegacyTask(task);
    const payload = buildTaskPayload(req.body, normalizedTask, currentUser, buildMemberMap(members));

    if (payload.error) {
      return res.status(400).json({ message: payload.error });
    }

    if (currentUser.role !== "admin") {
      payload.title = normalizedTask.title;
      payload.notes = normalizedTask.notes;
      payload.category = normalizedTask.category;
      payload.priority = normalizedTask.priority;
      payload.dueDate = normalizedTask.dueDate;
      payload.assignedToId = normalizedTask.assignedTo?.id || "";
      payload.assignedToName = normalizedTask.assignedTo?.name || "";
      payload.assignedToEmail = normalizedTask.assignedTo?.email || "";
    }

    Object.assign(task, payload);
    await task.save();

    res.json(normalizeLegacyTask(task));
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const currentUser = await loadCurrentUser(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const workspaceId = currentUser.workspaceId || String(currentUser._id);
    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ workspaceId }, { userId: req.user.id }],
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
