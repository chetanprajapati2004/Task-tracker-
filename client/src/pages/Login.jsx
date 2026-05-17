import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, ShieldCheck, TrendingUp } from "lucide-react";

import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-950 p-6">
      <div className="absolute left-10 top-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl md:grid-cols-2">
        <div className="hidden flex-col justify-center bg-gradient-to-br from-blue-700/50 to-indigo-900/50 p-12 text-white md:flex">
          <h1 className="mb-6 text-5xl font-bold">Task Admin</h1>
          <p className="mb-10 text-lg text-gray-200">
            Manage tasks, assign team members, and track progress in one place.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ClipboardList />
              <p>Track task status live</p>
            </div>
            <div className="flex items-center gap-4">
              <TrendingUp />
              <p>Monitor team progress</p>
            </div>
            <div className="flex items-center gap-4">
              <ShieldCheck />
              <p>Role-based admin and user access</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold">Welcome Back</h1>
            <p className="text-gray-500">Login to continue</p>
          </div>

          <input
            placeholder="Email"
            className="mb-5 w-full rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="mb-6 w-full rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 font-semibold text-white transition hover:scale-[1.02]"
          >
            Login
          </button>

          <p className="mt-6 text-center text-gray-500">
            No account?
            <Link to="/register" className="ml-2 font-semibold text-blue-600">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
