import { useDeferredValue, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Radio, Search } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import useRealtimeTasks from "../hooks/useRealtimeTasks";
import { formatDate, formatLabel } from "../utils/format";
import { taskPriorities, taskStatuses } from "../utils/tasks";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const deferredSearch = useDeferredValue(search);
  const { user } = useOutletContext();
  const isAdmin = user?.role === "admin";
  const { tasks: list, lastUpdated } = useRealtimeTasks();

  const memberOptions = useMemo(() => {
    const map = new Map();
    list.forEach((item) => {
      if (item.assignedTo?.id) {
        map.set(item.assignedTo.id, item.assignedTo);
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [list]);

  const filtered = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    const priorityOrder = { high: 0, medium: 1, low: 2 };

    const nextList = list.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query) ||
        (item.notes || "").toLowerCase().includes(query) ||
        (item.assignedTo?.name || "").toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
      const matchesAssignee =
        !isAdmin ||
        assigneeFilter === "all" ||
        (assigneeFilter === "unassigned"
          ? !item.assignedTo
          : item.assignedTo?.id === assigneeFilter);

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });

    nextList.sort((first, second) => {
      if (sortBy === "oldest") {
        return new Date(first.date).getTime() - new Date(second.date).getTime();
      }

      if (sortBy === "priority") {
        return priorityOrder[first.priority] - priorityOrder[second.priority];
      }

      if (sortBy === "due-date") {
        if (!first.dueDate && !second.dueDate) {
          return 0;
        }

        if (!first.dueDate) {
          return 1;
        }

        if (!second.dueDate) {
          return -1;
        }

        return new Date(first.dueDate).getTime() - new Date(second.dueDate).getTime();
      }

      return new Date(second.date).getTime() - new Date(first.date).getTime();
    });

    return nextList;
  }, [assigneeFilter, deferredSearch, isAdmin, list, priorityFilter, sortBy, statusFilter]);

  return (
    <div className="panel-card animate-fade-up">
      <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div>
          <h1 className="text-3xl font-bold">{isAdmin ? "All Tasks" : "My Tasks"}</h1>
          <p className="text-gray-500">
            {isAdmin ? "Search, filter, and monitor the full live task board" : "Your assigned tasks update automatically"}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          <Radio size={14} className="animate-pulse" />
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Syncing..."}
        </div>
      </div>

      <div className={`grid gap-3 ${isAdmin ? "sm:grid-cols-2 xl:grid-cols-5" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <option value="all">All Statuses</option>
          {taskStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <option value="all">All Priorities</option>
          {taskPriorities.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">Priority</option>
          <option value="due-date">Due Date</option>
        </select>

        {isAdmin ? (
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <option value="all">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {memberOptions.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="mb-4 mt-5 text-sm text-slate-500">
        Showing {filtered.length} of {list.length} tasks
      </div>

      <div className="space-y-4">
        {filtered.map((item, index) => {
          const isCompleted = item.status === "completed";
          return (
            <div
              key={item._id}
              className={`task-card animate-fade-up ${
                item.isOverdue ? "border-rose-200 bg-rose-50/40" : ""
              }`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 flex h-12 w-12 items-center justify-center rounded-full ${
                      isCompleted ? "bg-green-100" : item.isOverdue ? "bg-rose-100" : "bg-amber-100"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="text-green-600" />
                    ) : (
                      <Clock3 className={item.isOverdue ? "text-rose-500" : "text-amber-500"} />
                    )}
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatLabel(item.category)} | {formatLabel(item.priority)}
                    </p>
                    {isAdmin ? (
                      <p className="mt-1 text-sm text-slate-500">
                        {item.assignedTo ? `Assigned to ${item.assignedTo.name}` : "Unassigned"}
                      </p>
                    ) : null}
                    <p className="mt-2 max-w-2xl text-sm text-slate-600">
                      {item.notes || "No notes added for this task."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
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
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">
                      Overdue
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={16} />
                Due: {formatDate(item.dueDate)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}