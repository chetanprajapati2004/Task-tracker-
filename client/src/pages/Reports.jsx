import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

import api from "../services/api";
import { formatCurrency } from "../utils/format";

export default function Reports() {
  const [list, setList] = useState([]);

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

  const expense = list
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const saving = list
    .filter((item) => item.type === "saving")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = saving - expense;
  const total = expense + saving;
  const expensePercent = total ? ((expense / total) * 100).toFixed(0) : 0;
  const savingPercent = total ? ((saving / total) * 100).toFixed(0) : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-500">Financial overview</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Expenses</p>
              <h2 className="text-3xl font-bold text-red-500">
                {formatCurrency(expense)}
              </h2>
            </div>
            <TrendingDown size={40} className="text-red-500" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Savings</p>
              <h2 className="text-3xl font-bold text-green-500">
                {formatCurrency(saving)}
              </h2>
            </div>
            <TrendingUp size={40} className="text-green-500" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Balance</p>
              <h2 className="text-3xl font-bold text-blue-600">
                {formatCurrency(balance)}
              </h2>
            </div>
            <Wallet size={40} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/70">
        <h2 className="mb-6 text-xl font-bold">Monthly Breakdown</h2>

        <div className="mb-6">
          <div className="mb-2 flex justify-between">
            <p>Expense</p>
            <p>{expensePercent}%</p>
          </div>

          <div className="h-3 rounded-full bg-gray-200">
            <div
              style={{ width: `${expensePercent}%` }}
              className="h-3 rounded-full bg-red-500"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between">
            <p>Savings</p>
            <p>{savingPercent}%</p>
          </div>

          <div className="h-3 rounded-full bg-gray-200">
            <div
              style={{ width: `${savingPercent}%` }}
              className="h-3 rounded-full bg-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
