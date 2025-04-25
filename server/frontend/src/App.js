import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import axios from 'axios';

import Home from "./pages/Home";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ProjectManagement from "./pages/ProjectManagement";
import LocomotiveListPage from "./pages/LocomotiveListPage";
import WMSListPage from "./pages/WMSListPage";
import TaskListPage from "./pages/TaskListPage";
import SubtaskDetailPage from "./pages/SubtaskDetailPage";
import TaskDeatil from './pages/task/Taskdetail';

import DashboardLayout from "./components/DashboardLayout"; // ✅ 加了这一行

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/layout" element={<AppLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* add net status check */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/users"
          element={
            <DashboardLayout>
              <UserManagement />
            </DashboardLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <DashboardLayout>
              <ProjectManagement />
            </DashboardLayout>
          }
        />
        <Route
          path="/tasks"
          element={
            <DashboardLayout>
              <LocomotiveListPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/tasks/:locomotiveId/wms"
          element={
            <DashboardLayout>
              <WMSListPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/tasks/:locomotiveId/wms/:wmsId"
          element={
            <DashboardLayout>
              <TaskListPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/tasks/:locomotiveId/wms/:wmsId/task/:taskId"
          element={
            <DashboardLayout>
              <SubtaskDetailPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/taskdetail"
          element={
            <DashboardLayout>
              <TaskDeatil />
            </DashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
