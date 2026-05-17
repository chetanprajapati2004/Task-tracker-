const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

function getTaskGoal(user) {
  return Number.isFinite(Number(user?.taskGoal))
    ? Math.max(0, Number(user.taskGoal))
    : Number.isFinite(Number(user?.targetGoal))
      ? Math.max(0, Number(user.targetGoal))
      : 10;
}

function formatMember(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role || "user",
    adminUserId: user.adminUserId || String(user._id),
  };
}

async function getWorkspaceMembers(workspaceId) {
  const members = await User.find({ workspaceId })
    .select("_id name email role adminUserId")
    .sort({ name: 1 });

  return members.map(formatMember);
}

async function formatUser(user) {
  const workspaceId = user.workspaceId || String(user._id);
  const members = await getWorkspaceMembers(workspaceId);

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role || "user",
    adminUserId: user.adminUserId || String(user._id),
    workspaceId,
    taskGoal: getTaskGoal(user),
    members,
  };
}

async function loadCurrentUser(userId) {
  return User.findById(userId).select(
    "name email taskGoal targetGoal workspaceId role adminUserId",
  );
}

async function requireAdmin(userId) {
  const user = await loadCurrentUser(userId);

  if (!user) {
    return { error: "User not found", status: 404 };
  }

  if (user.role !== "admin") {
    return { error: "Only admin can access this panel", status: 403 };
  }

  return { user };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, taskGoal, targetGoal } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;
    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hash,
      workspaceId: "",
      role: isFirstUser ? "admin" : "user",
      adminUserId: "",
      taskGoal: Number.isFinite(Number(taskGoal))
        ? Math.max(0, Number(taskGoal))
        : Number.isFinite(Number(targetGoal))
          ? Math.max(0, Number(targetGoal))
          : 10,
      targetGoal: undefined,
    });

    await user.save();
    user.workspaceId = String(user._id);
    user.adminUserId = String(user._id);
    await user.save();

    res.json({
      msg: "Registration successful",
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: await formatUser(user),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await loadCurrentUser(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(await formatUser(user));
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/members", auth, async (req, res) => {
  try {
    const adminCheck = await requireAdmin(req.user.id);
    if (adminCheck.error) {
      return res.status(adminCheck.status).json({ msg: adminCheck.error });
    }

    res.json(
      await getWorkspaceMembers(
        adminCheck.user.workspaceId || String(adminCheck.user._id),
      ),
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/members", auth, async (req, res) => {
  try {
    const adminCheck = await requireAdmin(req.user.id);
    if (adminCheck.error) {
      return res.status(adminCheck.status).json({ msg: adminCheck.error });
    }

    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ msg: "Enter member email" });
    }

    const currentUser = adminCheck.user;
    const member = await User.findOne({ email });
    if (!member) {
      return res.status(404).json({ msg: "Member not found. Ask them to register first." });
    }

    if (String(member._id) === String(currentUser._id)) {
      return res.status(400).json({ msg: "Admin is already in this workspace." });
    }

    const currentWorkspaceId = currentUser.workspaceId || String(currentUser._id);

    await User.findByIdAndUpdate(member._id, {
      workspaceId: currentWorkspaceId,
      adminUserId: String(currentUser._id),
      role: "user",
    });

    await Task.updateMany(
      {
        $or: [
          { workspaceId: member.workspaceId || String(member._id) },
          { userId: String(member._id) },
        ],
      },
      {
        $set: {
          workspaceId: currentWorkspaceId,
        },
      },
    );

    const refreshedUser = await loadCurrentUser(req.user.id);
    res.json(await formatUser(refreshedUser));
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

const updateTaskGoal = async (req, res) => {
  try {
    const nextGoal = Number(req.body.taskGoal ?? req.body.targetGoal);

    if (!Number.isFinite(nextGoal) || nextGoal < 0) {
      return res.status(400).json({ msg: "Enter valid target" });
    }

    await User.findByIdAndUpdate(req.user.id, { taskGoal: nextGoal }, { new: true });
    const user = await loadCurrentUser(req.user.id);
    res.json(await formatUser(user));
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
};

router.patch("/task-goal", auth, updateTaskGoal);
router.patch("/target-goal", auth, updateTaskGoal);

module.exports = router;
