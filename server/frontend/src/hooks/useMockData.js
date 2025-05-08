// src/hooks/useMockData.js
import { useState, useEffect } from "react";
import { fetchLocomotives, fetchWMSByLocomotive, fetchTasksByWMS, fetchTaskDetail, addLocomotive, addWMS } from "../mock/mockApi"; // import addLocomotive, addWMS
import { fetchBaselines, addBaseline, deleteBaseline } from "../mock/mockApi";
import { updateLocomotive, deleteLocomotive as removeLocomotive } from "../mock/mockApi";
import { deleteWMS as removeWMS } from "../mock/mockApi";

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

  const createLocomotive = async (newLoco) => {
    await addLocomotive(newLoco);
    await reloadLocomotives();
  };

  const editLocomotive = async (locomotiveId, updatedFields) => {
    await updateLocomotive(locomotiveId, updatedFields);
    await reloadLocomotives();
  };
  
  const deleteLocomotive = async (locomotiveId) => {
    await removeLocomotive(locomotiveId);
    await reloadLocomotives();
  };
  
  return {
    locomotives,
    loading,
    createLocomotive,
    editLocomotive,
    deleteLocomotive,
  };
  
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

  const deleteWMS = async (wmsId) => {
    await removeWMS(locomotiveId, wmsId);
    await reloadWMS(); // refresh list
  };

  return { wmsList, loading, createWMS, deleteWMS };
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

export const useBaselines = () => {
  const [baselines, setBaselines] = useState([]);
  const [loading, setLoading] = useState(true);

  const reloadBaselines = async () => {
    const data = await fetchBaselines();
    setBaselines(data);
    setLoading(false);
  };

  useEffect(() => {
    reloadBaselines();
  }, []);

  const createBaseline = async (newBaseline) => {
    await addBaseline(newBaseline);
    await reloadBaselines();
  };

  const removeBaseline = async (baselineId) => {
    await deleteBaseline(baselineId);
    await reloadBaselines();
  };

  return { baselines, loading, createBaseline, removeBaseline };
};