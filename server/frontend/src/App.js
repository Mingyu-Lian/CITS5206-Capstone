import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login1 from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ProjectManagement from "./pages/ProjectManagement";
import TaskManagement from './pages/TaskManagement';
import TaskDeatil from './pages/Task/Taskdetail';
import CommissionDetail from './pages/Commission/CommissionDetail';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login1" element={<Login1/>} />
                <Route path="/layout" element={<AppLayout />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/projects" element={<ProjectManagement />} />
                <Route path="/tasks" element={<TaskManagement />} />
                <Route path="/taskdetail" element={<TaskDeatil />} />
                <Route path="/commissiondetail" element={<CommissionDetail />} />


            </Routes>
        </Router>
    );
}
export default App;