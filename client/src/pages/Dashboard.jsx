import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  Pencil,
  Plus,
  Radio,
  RotateCw,
  Trash2,
  TrendingUp,
} from "lucide-react";

import api from "../services/api";
import useRealtimeTasks from "../hooks/useRealtimeTasks";
import { formatCount, formatDate, formatLabel, toDateInputValue } from "../utils/format";
import { taskPriorities, taskStatuses } from "../utils/tasks";

const defaultForm = {
  title: "",
  category: "",
  notes: "",
  priority: "medium",
  status: "pending",
  dueDate: "",
  assignedToId: "",
};

export default function Dashboard() {
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const { tasks: list, loading, lastUpdated, refreshTasks } = useRealtimeTasks();
  const { user, members } = useOutletContext();
  const isAdmin = user?.role === "admin";

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const submit = async () => {
    if (!form.title.trim()) {
      alert("Enter a task title");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category.trim() || "General",
      notes: form.notes.trim(),
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || null,
      assignedToId: form.assignedToId || "",
    };

    try {
      if (editingId) {
        await api.patch(`/tasks/${editingId}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      resetForm();
      refreshTasks();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || (editingId ? "Unable to update task" : "Unable to add task"));
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      if (editingId === id) {
        resetForm();
      }
      refreshTasks();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Unable to delete task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setForm({
      title: task.title || "",
      category: task.category || "",
      notes: task.notes || "",
      priority: task.priority || "medium",
      status: task.status || "pending",
      dueDate: toDateInputValue(task.dueDate),
      assignedToId: task.assignedTo?.id || "",
    });
  };

  const updateTaskStatus = async (task, nextStatus) => {
    try {
      await api.patch(`/tasks/${task._id}`, {
        title: task.title,
        category: task.category,
        notes: task.notes,
        priority: task.priority,
        dueDate: task.dueDate,
        status: nextStatus,
        assignedToId: task.assignedTo?.id || "",
      });
      refreshTasks();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Unable to update task status");
    }
  };

  const completed = list.filter((item) => item.status === "completed").length;
  const inProgress = list.filter((item) => item.status === "in-progress").length;
  const pending = list.filter((item) => item.status === "pending").length;
  const overdue = list.filter((item) => item.isOverdue).length;
  const progress = user?.taskGoal
    ? Math.min(100, Math.round((completed / user.taskGoal) * 100))
    : 0;

  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";

  const recentTasks = [...list].slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="task-hero animate-fade-up">
        <div className="task-orb task-orb-left" />
        <div className="task-orb task-orb-right" />
        <h1 className="mb-2 text-2xl font-bold md:text-4xl">
          {greeting}, <span className="ml-2 text-amber-200">{user?.name || "User"}</span>
        </h1>
        <p className="text-sm opacity-90 md:text-base">
          {isAdmin
            ? "Create, assign, and control the team workflow from one place."
            : "Focus on your assigned tasks and keep your work moving."}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
          <Radio size={14} className="animate-pulse text-emerald-300" />
          {lastUpdated ? `Live sync active • ${lastUpdated.toLocaleTimeString()}` : "Syncing..."}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="glass-card">
            <p className="text-sm text-blue-100">Task Goal</p>
            <h2 className="mt-2 text-2xl font-bold">{formatCount(user?.taskGoal)} tasks</h2>
          </div>

          <div className="glass-card">
            <p className="text-sm text-blue-100">Current Momentum</p>
            <h2 className="mt-2 text-2xl font-bold">
              {completed >= pending ? "Steady" : "Needs focus"}
            </h2>
          </div>

          <div className="glass-card">
            <p className="text-sm text-blue-100">Overdue Tasks</p>
            <h2 className="mt-2 text-2xl font-bold">{formatCount(overdue)}</h2>
          </div>

          <div className="glass-card">
            <p className="text-sm text-blue-100">Goal Progress</p>
            <h2 className="mt-2 text-2xl font-bold">{progress}%</h2>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Tasks", value: list.length, color: "text-slate-900" },
          { label: "Completed", value: completed, color: "text-green-600" },
          { label: "In Progress", value: inProgress, color: "text-blue-600" },
          { label: "Pending", value: pending, color: "text-amber-500" },
          { label: "Overdue", value: overdue, color: "text-rose-500" },
        ].map((card, index) => (
          <div
            key={card.label}
            className="panel-card animate-fade-up"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <p className="mb-2 text-gray-500">{card.label}</p>
            <h2 className={`text-3xl font-bold ${card.color}`}>{formatCount(card.value)}</h2>
          </div>
        ))}
      </section>

      {isAdmin ? (
        <section className="panel-card animate-fade-up">
          <div className="mb-5 flex items-center gap-3">
            <Plus />
            <h2 className="text-xl font-bold">{editingId ? "Edit Task" : "Create Task"}</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <input
              value={form.title}
              onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
              placeholder="Task title"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <input
              value={form.category}
              onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}
              placeholder="Category"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((current) => ({ ...current, dueDate: e.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <select
              value={form.priority}
              onChange={(e) => setForm((current) => ({ ...current, priority: e.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              {taskPriorities.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>

            <select
              value={form.status}
              onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              {taskStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={form.assignedToId}
              onChange={(e) => setForm((current) => ({ ...current, assignedToId: e.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                  {member.id === user?.id ? " (You)" : ""}
                </option>
              ))}
            </select>

            <textarea
              value={form.notes}
              onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
              placeholder="Notes"
              rows={4}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 xl:col-span-3"
            />

            <div className="flex flex-wrap gap-3 xl:col-span-3">
              <button onClick={submit} className="primary-action">
                <Plus size={18} />
                {editingId ? "Save Changes" : "Create Task"}
              </button>

              {editingId ? (
                <button onClick={resetForm} className="secondary-action">
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{isAdmin ? "Team Tasks" : "Your Tasks"}</h2>
            <p className="text-gray-500">
              {isAdmin ? "Live task board for the whole workspace" : "Live queue of tasks assigned to you"}
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-2 shadow">
            {formatCount(list.length)} Tasks
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="panel-card">
            <div className="mb-3 flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={18} />
              <h3 className="font-semibold text-slate-900">Smart Snapshot</h3>
            </div>
            <p className="text-sm text-slate-600">
              {overdue > 0
                ? `You have ${formatCount(overdue)} overdue task${overdue > 1 ? "s" : ""}. Start there first.`
                : completed >= pending
                  ? "Completed tasks are keeping pace. Workflow looks healthy."
                  : "Pending tasks are stacking up. Closing a few quick wins will help."}
            </p>
          </div>

          <div className="panel-card">
            <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Progress To Goal
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{progress}%</h3>
            <p className="text-sm text-slate-600">
              Completed {formatCount(completed)} of {formatCount(user?.taskGoal)} tasks.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="panel-card text-center">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="panel-card text-center">
            <div className="mb-4 flex justify-center">
              <ListTodo className="h-16 w-16 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold">No Tasks Yet</h2>
            <p className="text-gray-500">{isAdmin ? "Create the first task to get started" : "No tasks assigned yet"}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentTasks.map((item, index) => {
              const isCompleted = item.status === "completed";

              return (
                <div
                  key={item._id}
                  className={`task-card animate-fade-up ${item.isOverdue ? "ring-2 ring-rose-100" : ""}`}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                          isCompleted ? "bg-green-100" : item.isOverdue ? "bg-rose-100" : "bg-amber-100"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={24} className="text-green-600" />
                        ) : (
                          <Clock3 size={24} className={item.isOverdue ? "text-rose-500" : "text-amber-500"} />
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                            {formatLabel(item.category)}
                          </span>
                          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                            {formatLabel(item.priority)}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : item.status === "in-progress"
                                  ? "bg-cyan-100 text-cyan-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {formatLabel(item.status)}
                          </span>
                          {item.isOverdue ? (
                            <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs text-rose-700">
                              Overdue
                            </span>
                          ) : null}
                          {item.assignedTo ? (
                            <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700">
                              Assigned: {item.assignedTo.name}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="flex flex-wrap gap-2">
                        {taskStatuses.map((status) => {
                          const active = item.status === status.value;
                          return (
                            <button
                              key={status.value}
                              onClick={() => updateTaskStatus(item, status.value)}
                              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                                active
                                  ? "bg-slate-900 text-white shadow-lg shadow-slate-300/60"
                                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <RotateCw size={15} />
                              {status.label}
                            </button>
                          );
                        })}
                      </div>

                      {isAdmin ? (
                        <button onClick={() => startEdit(item)} className="secondary-action">
                          <Pencil size={16} />
                          Edit
                        </button>
                      ) : null}

                      {isAdmin ? (
                        <button
                          onClick={() => remove(item._id)}
                          className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-slate-400" />
                      <span>Due: {formatDate(item.dueDate)}</span>
                    </div>

                    <div className="md:max-w-2xl">{item.notes || "No notes added yet."}</div>
                  </div>

                  <div className="text-xs text-slate-500">
                    Created by {item.createdBy?.name || "Unknown"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
