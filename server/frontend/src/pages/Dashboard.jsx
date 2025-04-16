import AdminDashboard from "./dashboard/AdminDashboard";
import SupervisorDashboard from "./dashboard/SupervisorDashboard";
import EngineerDashboard from "./dashboard/EngineerDashboard";

const Dashboard = () => {
  const role = localStorage.getItem("role");

  switch (role) {
    case "Admin":
      return <AdminDashboard />;
    case "Supervisor":
      return <SupervisorDashboard />;
    case "Engineer":
      return <EngineerDashboard />;
    default:
      return <div>Unauthorized. Please log in.</div>;
  }
};

export default Dashboard;
