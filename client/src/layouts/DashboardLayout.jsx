import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/me");

        if (!active) {
          return;
        }

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.log(err);
      }
    };

    loadProfile();

    const timer = setInterval(() => {
      loadProfile();
    }, 5000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const refreshProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <Sidebar open={open} setOpen={setOpen} user={user} />

        <main className="min-w-0 flex-1 bg-gray-50 p-4 md:p-6 lg:ml-[300px]">
          <Navbar setOpen={setOpen} user={user} />

          <Outlet
            context={{
              user,
              setUser,
              members: user?.members || [],
              refreshProfile,
            }}
          />
        </main>
      </div>
    </div>
  );
}
