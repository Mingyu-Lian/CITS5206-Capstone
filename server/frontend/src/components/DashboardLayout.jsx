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
import useNetworkStatus from "../utils/useNetworkStatus"; // ✅ 引入

const { Header, Content } = Layout;

const DashboardLayout = ({ children }) => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useNetworkStatus(); // ✅ 获取网络状态

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



  menuItems.push({
    label: "Logout",
    key: "logout",
    icon: <LogoutOutlined />,
  });

  const onMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.clear();
      navigate("/login");
    } else {
      navigate(key);
    }
  };

  return (
    <Layout>
      <Header style={{ background: "#fff", padding: 0, display: "flex", alignItems: "center" }}>
        {/* ✅ net status Tag */}
        <div style={{ marginLeft: 16, marginRight: 32 }}>
          <Tag color={isOnline ? "green" : "red"} icon={<WifiOutlined />}>
            {isOnline ? "Online" : "Offline"}
          </Tag>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={onMenuClick}
          style={{ flex: 1 }}
        />
      </Header>
      <Content style={{ padding: "24px 48px" }}>
        <Typography.Title level={3}>eWMS Dashboard</Typography.Title>
        {children}
      </Content>
    </Layout>
  );
};

export default DashboardLayout;
