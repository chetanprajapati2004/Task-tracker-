const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: String,
  workspaceId: {
    type: String,
    default: "",
  },
  createdByName: {
    type: String,
    default: "",
    trim: true,
  },
  createdByEmail: {
    type: String,
    default: "",
    trim: true,
  },
  assignedToId: {
    type: String,
    default: "",
  },
  assignedToName: {
    type: String,
    default: "",
    trim: true,
  },
  assignedToEmail: {
    type: String,
    default: "",
    trim: true,
  },

  title: {
    type: String,
    required: true,
    trim: true,
  },

  notes: {
    type: String,
    default: "",
    trim: true,
  },

  category: {
    type: String,
    default: "General",
    trim: true,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  type: {
    type: String,
    default: undefined,
  },

  amount: {
    type: Number,
    default: undefined,
  },

  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },

  dueDate: {
    type: Date,
    default: null,
  },

  completedAt: {
    type: Date,
    default: null,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema, "expenses");
