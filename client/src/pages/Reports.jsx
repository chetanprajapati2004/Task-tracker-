import { AlertTriangle, CheckCircle2, Clock3, ListChecks, TimerReset } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import useRealtimeTasks from "../hooks/useRealtimeTasks";
import { formatCount } from "../utils/format";

export default function Reports() {
  const { user } = useOutletContext();
  const isAdmin = user?.role === "admin";
  const { tasks: list } = useRealtimeTasks();

  const completed = list.filter((item) => item.status === "completed").length;
  const inProgress = list.filter((item) => item.status === "in-progress").length;
  const pending = list.filter((item) => item.status === "pending").length;
  const highPriority = list.filter((item) => item.priority === "high").length;
  const overdue = list.filter((item) => item.isOverdue).length;
  const assigned = list.filter((item) => item.assignedTo).length;
  const total = list.length;
  const completedPercent = total ? ((completed / total) * 100).toFixed(0) : 0;
  const inProgressPercent = total ? ((inProgress / total) * 100).toFixed(0) : 0;
  const pendingPercent = total ? ((pending / total) * 100).toFixed(0) : 0;
  const highPriorityPercent = total ? ((highPriority / total) * 100).toFixed(0) : 0;
  const assignedPercent = total ? ((assigned / total) * 100).toFixed(0) : 0;
  const memberLoad = list.reduce((accumulator, item) => {
    const key = item.assignedTo?.name || "Unassigned";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});
  const topLoads = Object.entries(memberLoad).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-500">
          {isAdmin
            ? "A live view of the whole team workload"
            : "A live view of your assigned task performance"}
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-5 md:grid-cols-3 ${isAdmin ? "xl:grid-cols-6" : "xl:grid-cols-5"}`}>
        {[
          { label: "Completed", value: completed, color: "text-green-600", icon: CheckCircle2 },
          { label: "In Progress", value: inProgress, color: "text-blue-500", icon: ListChecks },
          { label: "Pending", value: pending, color: "text-amber-500", icon: Clock3 },
          { label: "High Priority", value: highPriority, color: "text-indigo-600", icon: TimerReset },
          { label: "Overdue", value: overdue, color: "text-rose-600", icon: AlertTriangle },
          ...(isAdmin ? [{ label: "Assigned", value: assigned, color: "text-violet-600", icon: ListChecks }] : []),
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="panel-card animate-fade-up"
              style={{ animationDelay: `${index * 65}ms` }}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500">{card.label}</p>
                  <h2 className={`text-3xl font-bold ${card.color}`}>{formatCount(card.value)}</h2>
                </div>
                <Icon size={40} className={card.color} />
              </div>
            </div>
          );
        })}
      </div>

      <div className={`grid gap-6 ${isAdmin ? "xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]" : "xl:grid-cols-2"}`}>
        <div className="panel-card animate-fade-up">
          <h2 className="mb-6 text-xl font-bold">Task Breakdown</h2>

          {[
            { label: "Completed", percent: completedPercent, color: "bg-green-500" },
            { label: "In Progress", percent: inProgressPercent, color: "bg-blue-500" },
            { label: "Pending", percent: pendingPercent, color: "bg-amber-500" },
            { label: "High Priority", percent: highPriorityPercent, color: "bg-indigo-500" },
            ...(isAdmin ? [{ label: "Assigned", percent: assignedPercent, color: "bg-violet-500" }] : []),
          ].map((bar) => (
            <div key={bar.label} className="mb-6">
              <div className="mb-2 flex justify-between">
                <p>{bar.label}</p>
                <p>{bar.percent}%</p>
              </div>
              <div className="h-3 rounded-full bg-gray-200">
                <div style={{ width: `${bar.percent}%` }} className={`h-3 rounded-full ${bar.color}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="panel-card animate-fade-up">
          <h2 className="mb-5 text-xl font-bold">Signals</h2>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 p-4">
              Completion rate is <span className="font-semibold text-slate-900">{completedPercent}%</span>.
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              There are <span className="font-semibold text-slate-900">{formatCount(overdue)}</span> overdue tasks needing attention.
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <span className="font-semibold text-slate-900">{formatCount(highPriority)}</span> tasks are high priority.
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <span className="font-semibold text-slate-900">{formatCount(inProgress)}</span> items are active right now.
            </div>
            {isAdmin ? (
              <div className="rounded-2xl border border-slate-200 p-4">
                <span className="font-semibold text-slate-900">{formatCount(assigned)}</span> tasks already have owners.
              </div>
            ) : null}
          </div>
        </div>

        {isAdmin ? (
          <div className="panel-card animate-fade-up xl:col-span-2">
            <h2 className="mb-5 text-xl font-bold">Member Load</h2>
            <div className="space-y-4">
              {topLoads.map(([name, count]) => (
                <div key={name} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-2 flex justify-between">
                    <p className="font-semibold text-slate-900">{name}</p>
                    <p className="text-sm text-slate-500">{count} tasks</p>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      style={{ width: `${total ? Math.max((count / total) * 100, 8) : 0}%` }}
                      className="h-3 rounded-full bg-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}