import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import axios from 'axios';

import Home from "./pages/Home";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import BaselineDetail from './pages/Baseline/BaselineDetail';
import LocomotiveListPage from "./pages/LocomotiveListPage";
import WMSListPage from "./pages/WMSListPage";
import TaskListPage from "./pages/TaskListPage";
// import TaskDetail from './pages/task/Taskdetail';
import TaskJson from './pages/TaskJson/TaskJson';
import CommissionJson from './pages/CommissionJson/CommissionJson';
import DashboardLayout from "./components/DashboardLayout";
import BaselineListPage from "./pages/BaselineListPage";

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
        <Route path="/tasks" element={<DashboardLayout><LocomotiveListPage /></DashboardLayout>} />
        <Route path="/tasks/:locomotiveId/wms" element={<DashboardLayout><WMSListPage /></DashboardLayout>} />
        <Route path="/tasks/:locomotiveId/wms/:wmsId" element={<DashboardLayout><TaskListPage /></DashboardLayout>} />
        {/* <Route path="/taskdetail/:subtaskId" element={<DashboardLayout><TaskDetail /></DashboardLayout>} /> */}
        {/* <Route path="/taskdetail" element={<DashboardLayout><TaskDetail /></DashboardLayout>} /> */}
        <Route path="/baselines" element={<BaselineListPage />} />

        {/* These routes likely don't need DashboardLayout */}
        <Route path="/taskjson/:subtaskId" element={<TaskJson />} />
        <Route path="/commissionjson/:commissionId" element={<CommissionJson />} />
        <Route path="/baseline/:baselineId"  element={<BaselineDetail />} />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;