// src/pages/Dashboard.jsx
import AdminDashboard from "./dashboard/AdminDashboard";
import SupervisorDashboard from "./dashboard/SupervisorDashboard";
import EngineerDashboard from "./dashboard/EngineerDashboard";
import { useLocomotives } from "../hooks/useMockData"; // Import live hook for Admin
import { Spin } from "antd";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  const { locomotives, loading } = useLocomotives();

  if (loading && role === "Admin") {
    return <Spin style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} size="large" tip="Loading Dashboard..." />;
  }

  switch (role) {
    case "Admin":
      return <AdminDashboard locomotiveCount={locomotives.length} />;
    case "Supervisor":
      return <SupervisorDashboard />;
    case "Engineer":
      return <EngineerDashboard />;
    default:
      return <div>Unauthorized. Please log in.</div>;
  }
};

export default Dashboard;
