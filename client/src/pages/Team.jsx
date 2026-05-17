import { useMemo, useState } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { Mail, Shield, UserPlus, Users } from "lucide-react";

import api from "../services/api";
import useRealtimeTasks from "../hooks/useRealtimeTasks";

export default function Team() {
  const { user, setUser, members, refreshProfile } = useOutletContext();
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const { tasks, lastUpdated } = useRealtimeTasks();

  const adminTasks = useMemo(() => {
    return [];
  }, []);

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  const addMember = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      alert("Enter a member email");
      return;
    }

    try {
      setSaving(true);
      const res = await api.post("/auth/members", { email: trimmedEmail });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setEmail("");
      await refreshProfile();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Unable to add member");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-gray-500">Manage members from one simple admin-only space</p>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#38bdf8_100%)] p-6 text-white shadow-xl shadow-blue-200/70">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-blue-100">
                Admin Workspace
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Control members and assignments from one place
              </h2>
            </div>
            <Shield className="shrink-0 text-cyan-200" size={38} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Role</p>
              <h3 className="mt-2 text-2xl font-bold">Admin</h3>
            </div>
            <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Members</p>
              <h3 className="mt-2 text-2xl font-bold">{members.length || 1}</h3>
            </div>

          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur">
          <div className="mb-5 flex items-center gap-3">
            <UserPlus className="text-blue-600" size={20} />
            <div>
              <h2 className="font-bold text-slate-900">Add User</h2>
              <p className="text-sm text-slate-500">
                Only admin can attach users to this workspace
              </p>
            </div>
          </div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            User Email
          </label>

          <div className="flex gap-3">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
              <Mail size={18} className="text-slate-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-transparent py-4 outline-none"
              />
            </div>

            <button
              onClick={addMember}
              disabled={saving}
              className="rounded-2xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/70">
          <h2 className="mb-6 text-xl font-bold">Users</h2>

          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {member.name}
                    {member.id === user?.id ? " (You)" : ""}
                  </h3>
                  <p className="text-sm text-slate-500">{member.email}</p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {member.role === "admin" ? "Admin" : "User"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="mb-5 flex items-center gap-3">
            <Users className="text-blue-600" size={20} />
            <h2 className="text-xl font-bold">Admin Notes</h2>
          </div>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 p-4">
              Only admin can add users to this workspace.
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              Only admin can create, assign, edit, and delete tasks.
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              Users can still open the dashboard and update task status.
            </div>
            
            <div className="rounded-2xl border border-slate-200 p-4">
              Admin tasks are the tasks created from the admin account in the dashboard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}