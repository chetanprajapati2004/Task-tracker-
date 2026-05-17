import { Menu, Sparkles } from "lucide-react";

export default function Navbar({ setOpen, user }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-[28px] border border-white/60 bg-white/80 px-4 py-4 shadow-lg shadow-slate-200/60 backdrop-blur-xl md:px-6">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
         Welcome back, {user?.name || "User"}
        </p>
        <h1 className="truncate text-lg font-bold text-slate-900 md:text-2xl">
          
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white md:flex">
          <Sparkles size={16} />
          Stay on top of every rupee
        </div>

        <button
          className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200 md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </button>
      </div>
    </div>
  );
}
