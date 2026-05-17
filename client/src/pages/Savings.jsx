import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CheckCircle2,
  PencilLine,
  PiggyBank,
  Target,
  Wallet,
} from "lucide-react";

import api from "../services/api";
import { formatCurrency } from "../utils/format";

export default function Savings() {
  const [list, setList] = useState([]);
  const [goalInput, setGoalInput] = useState("");
  const [savingGoal, setSavingGoal] = useState(false);
  const { user, setUser } = useOutletContext();

  const goal = Number(user?.targetGoal) || 0;

  const load = async () => {
    try {
      const res = await api.get("/expense");
      setList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setGoalInput(goal ? String(goal) : "");
  }, [goal]);

  const savings = list
    .filter((item) => item.type === "saving")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const progress = (goal ? (savings / goal) * 100 : 0).toFixed(0);
  const remaining = Math.max(goal - savings, 0);

  const saveGoal = async () => {
    const nextGoal = Number(goalInput);

    if (!Number.isFinite(nextGoal) || nextGoal < 0) {
      alert("Enter a valid target goal");
      return;
    }

    try {
      setSavingGoal(true);
      const res = await api.patch("/auth/target-goal", {
        targetGoal: nextGoal,
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
      alert("Unable to update target goal");
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Savings Dashboard</h1>
        <p className="text-gray-500">Track your saving goals</p>
      </div>

      <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <div className="rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#38bdf8_100%)] p-6 text-white shadow-xl shadow-blue-200/70">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-blue-100">
                Savings Mission
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Build your next milestone faster
              </h2>
            </div>
            <PiggyBank className="shrink-0 text-cyan-200" size={38} />
          </div>

          <p className="max-w-2xl text-sm text-blue-50/90 md:text-base">
            Update your goal from here and track how much of your savings
            target is already complete in real time.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Saved so far</p>
              <h3 className="mt-2 text-2xl font-bold">
                {formatCurrency(savings)}
              </h3>
            </div>
            <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Target</p>
              <h3 className="mt-2 text-2xl font-bold">
                {formatCurrency(goal)}
              </h3>
            </div>
            <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Completion</p>
              <h3 className="mt-2 text-2xl font-bold">{progress}%</h3>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur">
          <div className="mb-5 flex items-center gap-3">
            <PencilLine className="text-blue-600" size={20} />
            <div>
              <h2 className="font-bold text-slate-900">Edit Target Goal</h2>
              <p className="text-sm text-slate-500">
                Saved directly in the backend profile
              </p>
            </div>
          </div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Goal Amount
          </label>

          <input
            type="number"
            min="0"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Enter target goal"
          />

          <button
            onClick={saveGoal}
            disabled={savingGoal}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 p-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckCircle2 size={18} />
            {savingGoal ? "Saving..." : "Save Goal"}
          </button>

          <p className="mt-4 text-sm text-slate-500">
            Remaining to hit your current target:{" "}
            <span className="font-semibold text-slate-900">
              {formatCurrency(remaining)}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Current Savings</p>
              <h2 className="text-3xl font-bold text-green-600">
                {formatCurrency(savings)}
              </h2>
            </div>
            <PiggyBank size={40} className="text-green-600" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Target Goal</p>
              <h2 className="text-3xl font-bold text-blue-600">
                {formatCurrency(goal)}
              </h2>
            </div>
            <Target size={40} className="text-blue-600" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Remaining</p>
              <h2 className="text-3xl font-bold text-orange-500">
                {formatCurrency(remaining)}
              </h2>
            </div>
            <Wallet size={40} className="text-orange-500" />
          </div>
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/70">
        <h2 className="mb-6 text-xl font-bold">Goal Progress</h2>

        <div className="mb-3 flex justify-between">
          <p>Completed</p>
          <p>{progress}%</p>
        </div>

        <div className="h-4 rounded-full bg-gray-200">
          <div
            style={{ width: `${Math.min(Number(progress), 100)}%` }}
            className="h-4 rounded-full bg-green-500 transition-all duration-500"
          />
        </div>

        <div className="mt-6 space-y-3">
          {list
            .filter((item) => item.type === "saving")
            .map((item) => (
              <div
                key={item._id}
                className="flex justify-between rounded-xl border p-4"
              >
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">Saving Entry</p>
                </div>

                <h3 className="font-bold text-green-600">
                  {formatCurrency(item.amount)}
                </h3>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
