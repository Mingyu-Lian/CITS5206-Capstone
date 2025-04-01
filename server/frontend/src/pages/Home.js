import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";
const Home = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "unknown";

  const handleLogout = () => {
    logout(); // Update authentication state
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>You are logged in as: <strong>{role}</strong></p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;