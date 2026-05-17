const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  workspaceId: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  adminUserId: {
    type: String,
    default: "",
  },
  taskGoal: {
    type: Number,
    default: 10,
    min: 0,
  },
  targetGoal: {
    type: Number,
    default: undefined,
  },
});

module.exports = mongoose.model("User", UserSchema);
