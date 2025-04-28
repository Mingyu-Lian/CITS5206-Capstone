// src/hooks/useMockData.js
import { useState, useEffect } from "react";
import { fetchLocomotives, fetchWMSByLocomotive, fetchTasksByWMS, fetchTaskDetail, addLocomotive, addWMS } from "../mock/mockApi"; // import addLocomotive, addWMS

export const useLocomotives = () => {
  const [locomotives, setLocomotives] = useState([]);
  const [loading, setLoading] = useState(true);

  const reloadLocomotives = async () => {
    const data = await fetchLocomotives();
    setLocomotives(data);
    setLoading(false);
  };

  useEffect(() => {
    reloadLocomotives();
  }, []);

  // 🛠️ Here is the missing part:
  const createLocomotive = async (newLoco) => {
    await addLocomotive(newLoco);
    await reloadLocomotives(); // refresh the list
  };

  return { locomotives, loading, createLocomotive };
};

export const useWMS = (locomotiveId) => {
  const [wmsList, setWmsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const reloadWMS = async () => {
    const data = await fetchWMSByLocomotive(locomotiveId);
    setWmsList(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!locomotiveId) return;
    reloadWMS();
  }, [locomotiveId]);

  const createWMS = async (newWMS) => {
    await addWMS(locomotiveId, newWMS);
    await reloadWMS(); // refresh
  };

  return { wmsList, loading, createWMS };
};

export const useTasks = (locomotiveId, wmsId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locomotiveId || !wmsId) return;
    const loadData = async () => {
      const data = await fetchTasksByWMS(locomotiveId, wmsId);
      setTasks(data);
      setLoading(false);
    };
    loadData();
  }, [locomotiveId, wmsId]);

  return { tasks, loading };
};

export const useTaskDetail = (locomotiveId, wmsId, taskId) => {
  const [taskDetail, setTaskDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locomotiveId || !wmsId || !taskId) return;
    const loadData = async () => {
      const data = await fetchTaskDetail(locomotiveId, wmsId, taskId);
      setTaskDetail(data);
      setLoading(false);
    };
    loadData();
  }, [locomotiveId, wmsId, taskId]);

  return { taskDetail, loading };
};
