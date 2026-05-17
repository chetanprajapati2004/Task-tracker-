import { useDeferredValue, useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Search } from "lucide-react";

import api from "../services/api";
import { formatCurrency } from "../utils/format";

export default function Transactions() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

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

  const filtered = list.filter((item) =>
    item.title.toLowerCase().includes(deferredSearch.toLowerCase())
  );

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-lg shadow-slate-200/70">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-gray-500">Track your spending history</p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between rounded-xl border p-4 transition hover:shadow"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  item.type === "expense" ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {item.type === "expense" ? (
                  <ArrowDownCircle className="text-red-500" />
                ) : (
                  <ArrowUpCircle className="text-green-500" />
                )}
              </div>

              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.type}</p>
              </div>
            </div>

            <h2
              className={`font-bold ${
                item.type === "expense" ? "text-red-500" : "text-green-500"
              }`}
            >
              {formatCurrency(item.amount)}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
