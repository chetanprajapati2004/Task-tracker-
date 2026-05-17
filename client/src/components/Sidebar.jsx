import {
  Home,
  Wallet,
  IndianRupee,
  PieChart,
  LogOut,
  User,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ open, setOpen, user }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Transactions", icon: <Wallet size={18} />, path: "/transactions" },
    { name: "Reports", icon: <PieChart size={18} />, path: "/reports" },
    { name: "Savings", icon: <IndianRupee size={18} />, path: "/savings" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

    <aside
className={`

fixed
left-0
top-0

z-50

flex
flex-col

h-screen

w-[280px]
md:w-[300px]

overflow-y-auto

bg-gradient-to-b
from-slate-950
via-slate-900
to-slate-950

text-white

border-r
border-white/10

shadow-2xl

p-6

transition-transform
duration-300

lg:translate-x-0

${open
? "translate-x-0"
: "-translate-x-full"}

`}
>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Expense Tracker</h1>
            <p className="text-sm text-gray-400">Manage finances smarter</p>
          </div>

          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>

        <div className="mb-8 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
            <User size={22} />
          </div>

          <div className="overflow-hidden">
            <h2 className="truncate text-lg font-semibold">
              {user?.name || "Guest"}
            </h2>
            <p className="truncate text-xs text-gray-400">
              {user?.email || "Welcome back"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-2xl px-4 py-4 transition-all ${
                  isActive
                    ? "bg-blue-600 shadow-lg shadow-blue-900/50"
                    : "hover:bg-white/10"
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 p-4 transition-all hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
