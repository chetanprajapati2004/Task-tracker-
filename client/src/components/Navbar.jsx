import { Menu, Radio, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ setOpen, user }) {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mb-6 flex items-center justify-between gap-4 rounded-[28px]
      border border-white/60 bg-white/80 px-4 py-4
      shadow-lg shadow-slate-200/60 backdrop-blur-xl md:px-6"
    >
      <div className="min-w-0">

        {/* Welcome text animation */}

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600"
        >
          Welcome back, {user?.name || "User"}
        </motion.p>


        {/* Gradient moving title */}

        <motion.h1
          animate={{
            backgroundPosition: ["0%", "100%", "0%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "linear",
          }}
          className="truncate bg-gradient-to-r
          from-blue-600 via-purple-600 to-pink-500
          bg-[length:200%]
          bg-clip-text text-lg font-extrabold
          text-transparent md:text-2xl"
        >
          {user?.role === "admin"
            ? "Admin Workspace"
            : "My Task Workspace"}
        </motion.h1>
      </div>

      <div className="flex items-center gap-3">

        {/* Live badge */}

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="hidden items-center gap-2 rounded-2xl
          border border-emerald-200 bg-emerald-50
          px-4 py-3 text-sm font-medium
          text-emerald-700 md:flex"
        >
          <Radio
            size={16}
            className="animate-pulse"
          />
          Live updates on
        </motion.div>


        {/* Sparkle badge */}

        <motion.div
          whileHover={{
            scale: 1.05,
            y: -2,
          }}
          className="hidden items-center gap-2 rounded-2xl
          bg-slate-950 px-4 py-3 text-sm
          font-medium text-white md:flex"
        >
          <motion.div
            animate={{
              rotate: [0, 20, -20, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          >
            <Sparkles size={16} />
          </motion.div>

          {user?.role === "admin"
            ? "Admin controls enabled"
            : "Own tasks only"}
        </motion.div>

        {/* Mobile menu */}

        <motion.button
          whileTap={{ scale: .9 }}
          whileHover={{ scale: 1.1 }}
          className="rounded-2xl bg-blue-600 p-3
          text-white shadow-lg shadow-blue-200 md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </motion.button>

      </div>
    </motion.div>
  );
}