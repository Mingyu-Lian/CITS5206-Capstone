import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import axios from 'axios';

import Home from "./pages/Home";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import CommissionDetail from './pages/commission/CommissionDetail';
import LocomotiveListPage from "./pages/LocomotiveListPage";
import WMSListPage from "./pages/WMSListPage";
import TaskListPage from "./pages/TaskListPage";
import SubtaskDetailPage from "./pages/SubtaskDetailPage";
import TaskDetail from './pages/task/Taskdetail';
import DashboardLayout from "./components/DashboardLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/layout" element={<AppLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Wrapped with DashboardLayout to include NetStatus and unified UI */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/users" element={<DashboardLayout><UserManagement /></DashboardLayout>} />
        <Route path="/commissiondetail" element={<DashboardLayout><CommissionDetail /></DashboardLayout>} />
        <Route path="/tasks" element={<DashboardLayout><LocomotiveListPage /></DashboardLayout>} />
        <Route path="/tasks/:locomotiveId/wms" element={<DashboardLayout><WMSListPage /></DashboardLayout>} />
        <Route path="/tasks/:locomotiveId/wms/:wmsId" element={<DashboardLayout><TaskListPage /></DashboardLayout>} />
        <Route path="/tasks/:locomotiveId/wms/:wmsId/task/:taskId" element={<DashboardLayout><SubtaskDetailPage /></DashboardLayout>} />
        <Route path="/taskdetail/:subtaskId" element={<DashboardLayout><TaskDetail /></DashboardLayout>} />
        <Route path="/taskdetail" element={<DashboardLayout><TaskDetail /></DashboardLayout>} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
