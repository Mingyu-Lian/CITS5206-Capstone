import locomotives from "./mockData";
import users from "./mockUsers";
import { baselines } from "./mockData";

// --------------------
// Locomotive + WMS + Task APIs
// --------------------

export const fetchLocomotives = async () => Promise.resolve(locomotives);

export const fetchWMSByLocomotive = async (locomotiveId) => {
  const loco = locomotives.find((l) => l.locomotiveId === locomotiveId);
  return Promise.resolve(loco?.wmsList || []);
};

export const fetchTasksByWMS = async (locomotiveId, wmsId) => {
  const loco = locomotives.find((l) => l.locomotiveId === locomotiveId);
  const wms = loco?.wmsList.find((w) => w.wmsId === wmsId);
  return Promise.resolve(wms?.tasks || []);
};

export const fetchTaskDetail = async (locomotiveId, wmsId, taskId) => {
  const loco = locomotives.find((l) => l.locomotiveId === locomotiveId);
  const wms = loco?.wmsList.find((w) => w.wmsId === wmsId);
  const task = wms?.tasks.find((t) => t.taskId === taskId);
  return Promise.resolve(task || null);
};

export const addLocomotive = async (newLoco) => {
  locomotives.push(newLoco);
  return Promise.resolve(true);
};

export const addWMS = async (locomotiveId, newWMS) => {
  const loco = locomotives.find((l) => l.locomotiveId === locomotiveId);
  if (loco) {
    loco.wmsList.push(newWMS);
  }
  return Promise.resolve(true);
};

export const updateLocomotive = async (locomotiveId, updatedFields) => {
  const loco = locomotives.find((l) => l.locomotiveId === locomotiveId);
  if (loco) {
    Object.assign(loco, updatedFields);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

export const deleteLocomotive = async (locomotiveId) => {
  const index = locomotives.findIndex((l) => l.locomotiveId === locomotiveId);
  if (index !== -1) {
    locomotives.splice(index, 1);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

export const deleteWMS = async (locomotiveId, wmsId) => {
  const loco = locomotives.find((l) => l.locomotiveId === locomotiveId);
  if (!loco) return Promise.resolve(false);
  const index = loco.wmsList.findIndex((w) => w.wmsId === wmsId);
  if (index !== -1) {
    loco.wmsList.splice(index, 1);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

// ----------------------
// User APIs
// ----------------------

export const fetchUsers = async () => Promise.resolve(users);

export const addUser = async (newUser) => {
  users.push(newUser);
  return Promise.resolve(true);
};

export const deleteUser = async (userId) => {
  const index = users.findIndex((user) => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

export const updateUser = async (userId, updatedFields) => {
  const user = users.find((user) => user.id === userId);
  if (user) {
    Object.assign(user, updatedFields);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

// ----------------------
// Baseline APIs
// ----------------------

export const fetchBaselines = async () => Promise.resolve(baselines);

export const addBaseline = async (newBaseline) => {
  baselines.push(newBaseline);
  return Promise.resolve(true);
};

export const deleteBaseline = async (baselineId) => {
  const index = baselines.findIndex((b) => b.id === baselineId);
  if (index !== -1) {
    baselines.splice(index, 1);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

// ----------------------
// Task Sign-Off APIs
// ----------------------

const taskSignOffs = {};

export const toggleTaskSignOff = async (taskId, engineerName) => {
  const key = `${taskId}-${engineerName}`;
  taskSignOffs[key] = !taskSignOffs[key];
  return Promise.resolve(taskSignOffs[key]);
};

export const fetchTaskSignOffs = async () => Promise.resolve({ ...taskSignOffs });

export const supervisorSignOffTask = async (locomotiveId, wmsId, taskId) => {
  const loco = locomotives.find((l) => l.locomotiveId === locomotiveId);
  const wms = loco?.wmsList.find((w) => w.wmsId === wmsId);
  const task = wms?.tasks.find((t) => t.taskId === taskId);

  if (task) {
    task.status = "Completed";
    return Promise.resolve(true);
  }

  return Promise.resolve(false);
};

export const getTaskDiscipline = async (locomotiveId, wmsId, taskId) => {
  const loco = locomotives.find((l) => l.locomotiveId === locomotiveId);
  const wms = loco?.wmsList.find((w) => w.wmsId === wmsId);
  const task = wms?.tasks.find((t) => t.taskId === taskId);
  return Promise.resolve(task?.discipline || null);
};

// ----------------------
// Engineer Assignment APIs (PERSISTED)
// ----------------------

export const fetchAssignedEngineers = async (taskId) => {
  const data = JSON.parse(localStorage.getItem("assignedEngineersMap") || "{}");
  return Promise.resolve(data[taskId] || []);
};

export const assignEngineerToTask = async (taskId, engineer) => {
  const data = JSON.parse(localStorage.getItem("assignedEngineersMap") || "{}");

  if (!data[taskId]) {
    data[taskId] = [];
  }

  const alreadyExists = data[taskId].some(
    (e) => e.name === engineer.name && e.discipline === engineer.discipline
  );

  if (!alreadyExists) {
    data[taskId].push(engineer);
  }

  localStorage.setItem("assignedEngineersMap", JSON.stringify(data));
  return Promise.resolve(true);
};

export const removeEngineerFromTask = async (taskId, engineerName) => {
  const data = JSON.parse(localStorage.getItem("assignedEngineersMap") || "{}");

  if (data[taskId]) {
    data[taskId] = data[taskId].filter((e) => e.name !== engineerName);
    localStorage.setItem("assignedEngineersMap", JSON.stringify(data));
  }

  return Promise.resolve(true);
};
