import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import BaselineListPage from "./pages/BaselineListPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/layout" element={<AppLayout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/tasks" element={<LocomotiveListPage />} />
                <Route path="/tasks/:locomotiveId/wms" element={<WMSListPage />} />
                <Route path="/tasks/:locomotiveId/wms/:wmsId" element={<TaskListPage />} />
                <Route path="/tasks/:locomotiveId/wms/:wmsId/task/:taskId" element={<SubtaskDetailPage />} />
                <Route path="/taskdetail/:subtaskId" element={<TaskDetail />} />
                <Route path="/taskdetail" element={<TaskDetail />} />
                <Route path="/commissiondetail" element={<CommissionDetail />} />
                <Route path="/baselines" element={<BaselineListPage />} />
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/login" />} />

            </Routes>
        </Router>
    );
}
export default App;