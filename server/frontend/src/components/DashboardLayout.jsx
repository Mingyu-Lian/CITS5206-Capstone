import { Layout, Menu, Typography, Tag } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import useNetworkStatus from "../utils/useNetworkStatus";

const { Header, Content } = Layout;

const DashboardLayout = ({ children }) => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useNetworkStatus();

  const menuItems = [
    {
      label: "Dashboard",
      key: "/dashboard",
      icon: <DashboardOutlined />,
    },
  ];

  if (["Admin", "Supervisor"].includes(role)) {
    menuItems.push({
      label: "User Management",
      key: "/users",
      icon: <UserOutlined />,
    });
  }



  //Task Management for all roles
  if (["Admin", "Supervisor", "Engineer"].includes(role)) {
    menuItems.push({
      label: "Task Management",
      key: "/tasks",
      icon: <CheckCircleOutlined />,
    });
  }

  if (["Admin"].includes(role)) {
    menuItems.push({
      label: "Baselines",
      key: "/baselines",
      icon: <FolderOpenOutlined />,
    });
  }



  menuItems.push({
    label: "Logout",
    key: "logout",
    icon: <LogoutOutlined />,
  });

  const onMenuClick = ({ key }) => {
    if (key === "logout") {
      const assigned = localStorage.getItem("assignedTasks");
      localStorage.clear();
      if (assigned) localStorage.setItem("assignedTasks", assigned);
      navigate("/login");
    }
    else {
      navigate(key);
    }
  };

  return (
    <Layout>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ✅ Left: Online Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Tag color={isOnline ? "green" : "red"} icon={<WifiOutlined />}>
            {isOnline ? "Online" : "Offline"}
          </Tag>
        </div>

        {/* ✅ Center: Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={onMenuClick}
          style={{ flex: 1, justifyContent: "center" }}
        />

        {/* ✅ Right: Role Display */}
        <div style={{ fontWeight: "bold", minWidth: 120, textAlign: "right" }}>
          Role: {role}
        </div>
      </Header>


      <Content style={{ padding: "24px 48px" }}>
        {children}
      </Content>
    </Layout>
  );
};

export default DashboardLayout;