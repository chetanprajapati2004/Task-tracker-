import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";

import api from "../services/api";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [list, setList] = useState([]);
  const { user } = useOutletContext();

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

  const add = async () => {
    if (!title || !amount) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post("/expense", {
        title,
        amount: Number(amount),
        type,
      });

      setTitle("");
      setAmount("");
      load();
    } catch (err) {
      console.log(err);
      alert("Unable to add transaction");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/expense/${id}`);
      load();
    } catch (err) {
      console.log(err);
      alert("Unable to delete transaction");
    }
  };

  const expense = list
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const saving = list
    .filter((item) => item.type === "saving")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = saving - expense;
  const progress = user?.targetGoal
    ? Math.min(100, Math.round((saving / user.targetGoal) * 100))
    : 0;

  const greeting =
    new Date().getHours() < 12
      ? "Good Morning"
      : new Date().getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";

  return (
    <div>
      <section className="mb-8 rounded-[30px] bg-gradient-to-r from-blue-600 via-cyan-600 to-slate-900 p-6 text-white shadow-lg md:p-8">
        <h1 className="mb-2 text-2xl font-bold md:text-4xl">
          {greeting}, <span className="ml-2 text-yellow-300">{user?.name || "User"}</span>
        </h1>
        <p className="text-sm opacity-90 md:text-base">
          Track expenses and savings smarter
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
            <p className="text-sm text-blue-100">Savings Target</p>
            <h2 className="mt-2 text-2xl font-bold">
              {formatCurrency(user?.targetGoal)}
            </h2>
          </div>

          <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
            <p className="text-sm text-blue-100">Current Momentum</p>
            <h2 className="mt-2 text-2xl font-bold">
              {saving >= expense ? "Positive" : "Watch spending"}
            </h2>
          </div>

          <div className="rounded-3xl bg-white/12 p-4 backdrop-blur sm:col-span-2 xl:col-span-1">
            <p className="text-sm text-blue-100">Goal Progress</p>
            <h2 className="mt-2 text-2xl font-bold">{progress}%</h2>
          </div>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="mb-2 text-gray-500">Expenses</p>
          <h2 className="text-3xl font-bold text-red-500">
            {formatCurrency(expense)}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="mb-2 text-gray-500">Savings</p>
          <h2 className="text-3xl font-bold text-green-600">
            {formatCurrency(saving)}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="mb-2 text-gray-500">Balance</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {formatCurrency(balance)}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="mb-2 text-gray-500">Target Goal</p>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl font-bold text-slate-900">
              {formatCurrency(user?.targetGoal)}
            </h2>
            <Target className="text-blue-600" size={28} />
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-3xl bg-white p-6 shadow">
        <div className="mb-5 flex items-center gap-3">
          <Plus />
          <h2 className="text-xl font-bold">Add Transaction</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded-xl border p-4 outline-none focus:border-blue-500"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="rounded-xl border p-4 outline-none focus:border-blue-500"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border p-4"
          >
            <option value="expense">Expense</option>
            <option value="saving">Saving</option>
          </select>

          <button

onClick={add}

className="
flex
items-center
justify-center
gap-2

px-6
py-3

rounded-2xl

bg-gradient-to-r
from-blue-600
to-indigo-600

hover:from-blue-700
hover:to-indigo-700

text-white
font-semibold

shadow-lg
shadow-blue-500/30

hover:scale-[1.03]

transition-all
duration-300
"

>

<Plus size={18}/>

Add Transaction

</button>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Recent Transactions</h2>
            <p className="text-gray-500">Your latest activity</p>
          </div>

          <div className="rounded-xl bg-white px-4 py-2 shadow">
            {list.length} Transactions
          </div>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-blue-100 bg-blue-50/80 p-5">
            <div className="mb-3 flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={18} />
              <h3 className="font-semibold text-slate-900">Smart Snapshot</h3>
            </div>
            <p className="text-sm text-slate-600">
              {saving >= expense
                ? "Savings are ahead of expenses. Keep the momentum going."
                : "Expenses are ahead of savings. Shift a few upcoming entries into savings to recover balance."}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-5">
            <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Progress To Goal
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{progress}%</h3>
            <p className="text-sm text-slate-600">
              Saved {formatCurrency(saving)} of {formatCurrency(user?.targetGoal)}.
            </p>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow">
            <div className="mb-4 text-6xl">Cash</div>
            <h2 className="text-xl font-bold">No Transactions Yet</h2>
            <p className="text-gray-500">Add your first transaction</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((item) => (
              <div
                key={item._id}
                className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-white p-5 shadow transition-all hover:-translate-y-1 hover:shadow-xl md:flex-row md:items-center"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      item.type === "expense" ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    {item.type === "expense" ? (
                      <ArrowDownCircle size={24} className="text-red-500" />
                    ) : (
                      <ArrowUpCircle size={24} className="text-green-600" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs ${
                        item.type === "expense"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-5 md:w-auto">
                  <h3
                    className={`text-xl font-bold ${
                      item.type === "expense" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {item.type === "expense" ? "-" : "+"}
                    {formatCurrency(item.amount)}
                  </h3>

                  <button
                    onClick={() => remove(item._id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
