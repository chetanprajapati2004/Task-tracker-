import { useEffect, useState } from "react";

import api from "../services/api";

export default function useRealtimeTasks(intervalMs = 5000) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadTasks = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      const res = await api.get("/tasks");
      setTasks(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.log(err);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let active = true;

    const initialLoad = async () => {
      if (!active) {
        return;
      }

      await loadTasks();
    };

    initialLoad();

    const timer = setInterval(() => {
      if (!active) {
        return;
      }

      loadTasks({ silent: true });
    }, intervalMs);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return {
    tasks,
    setTasks,
    loading,
    lastUpdated,
    refreshTasks: loadTasks,
  };
}
