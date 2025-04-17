// src/services/authService.js
import axios from "axios";
const API = "http://localhost:8080/api/auth"; // Your backend URL

export const loginUser = (email, password) =>
  axios.post(`${API}/login`, { email, password });

export const forgotPassword = (email) =>
  axios.post(`${API}/forgot-password`, { email });
