import { Layout, Menu, Typography } from "antd";
import { UserOutlined, DashboardOutlined, LogoutOutlined, FolderOpenOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Content } = Layout;

const DashboardLayout = ({ children }) => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

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

   //Project Management menu item (for all roles)
   if (["Admin", "Supervisor", "Engineer"].includes(role)) {
    menuItems.push({
      label: "Project Management",
      key: "/projects",
      icon: <FolderOpenOutlined />,
    });
  }

  // ✅ NEW: Add Task Management for all roles
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
      <Header style={{ background: "#fff", padding: 0 }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={onMenuClick}
          style={{ display: "flex", justifyContent: "center" }}
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
