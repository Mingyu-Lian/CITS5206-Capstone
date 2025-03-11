import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
