import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ProjectManagement from "./pages/ProjectManagement";
import TaskManagement from './pages/TaskManagement';
import TaskDeatil from './pages/task/Taskdetail';

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
                <Route path="/projects" element={<ProjectManagement />} />
                <Route path="/tasks" element={<TaskManagement />} />
                <Route path="/taskdetail" element={<TaskDeatil />} />

            </Routes>
        </Router>
    );
}
export default App;