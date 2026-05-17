import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";

import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Registered Successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-950 p-6">
      <div className="absolute left-10 top-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative w-full max-w-md rounded-[40px] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-gray-300">Start managing tasks with role-based access</p>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <User size={18} className="absolute left-4 top-4 text-gray-400" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-2xl bg-white p-4 pl-12 outline-none"
            />
          </div>

          <div className="relative">
            <Mail size={18} className="absolute left-4 top-4 text-gray-400" />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl bg-white p-4 pl-12 outline-none"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-4 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl bg-white p-4 pl-12 outline-none"
            />
          </div>

          <button
            onClick={register}
            className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-4 font-semibold text-white transition hover:scale-[1.02]"
          >
            Create Account
          </button>

          <p className="text-center text-gray-300">
            Already have account?
            <Link to="/" className="ml-2 font-semibold text-blue-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
