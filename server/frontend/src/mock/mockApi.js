// src/mock/mockApi.js
import locomotives from "./mockData";
import users from "./mockUsers"; // ✅ Make sure you import the users array!


// Fetch all locomotives
export const fetchLocomotives = async () => {
  return Promise.resolve(locomotives);
};

// Fetch WMS list for a specific locomotive
export const fetchWMSByLocomotive = async (locomotiveId) => {
  const loco = locomotives.find(l => l.locomotiveId === locomotiveId);
  return Promise.resolve(loco?.wmsList || []);
};

// Fetch Tasks list for a specific WMS
export const fetchTasksByWMS = async (locomotiveId, wmsId) => {
  const loco = locomotives.find(l => l.locomotiveId === locomotiveId);
  const wms = loco?.wmsList.find(w => w.wmsId === wmsId);
  return Promise.resolve(wms?.tasks || []);
};

// Fetch a specific Task detail
export const fetchTaskDetail = async (locomotiveId, wmsId, taskId) => {
  const loco = locomotives.find(l => l.locomotiveId === locomotiveId);
  const wms = loco?.wmsList.find(w => w.wmsId === wmsId);
  const task = wms?.tasks.find(t => t.taskId === taskId);
  return Promise.resolve(task || null);
};

// Add new Locomotive
export const addLocomotive = async (newLoco) => {
  locomotives.push(newLoco);
  return Promise.resolve(true);
};

// Add new WMS to a Locomotive
export const addWMS = async (locomotiveId, newWMS) => {
  const loco = locomotives.find(l => l.locomotiveId === locomotiveId);
  if (loco) {
    loco.wmsList.push(newWMS);
  }
  return Promise.resolve(true);
};

// --------------------------------------
// User API - simulate user management
// --------------------------------------

// Fetch all users
export const fetchUsers = async () => {
  return Promise.resolve(users);
};

// Add a new user
export const addUser = async (newUser) => {
  users.push(newUser);
  return Promise.resolve(true);
};

// Delete user by id
export const deleteUser = async (userId) => {
  const index = users.findIndex(user => user.id === userId);
  if (index !== -1) {
    users.splice(index, 1);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

// Update user
export const updateUser = async (userId, updatedFields) => {
  const user = users.find(user => user.id === userId);
  if (user) {
    Object.assign(user, updatedFields);
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};
