// src/components/PageLayout.jsx
import { Layout, Menu, Typography } from "antd";
import { UserOutlined, DashboardOutlined, LogoutOutlined, FolderOpenOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Content } = Layout;

const PageLayout = ({ children }) => {
  const role = localStorage.getItem("role") || "Guest";
  const discipline = localStorage.getItem("discipline") || "None";
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", key: "/dashboard", icon: <DashboardOutlined /> },
    { label: "Project Management", key: "/projects", icon: <FolderOpenOutlined /> },
    { label: "Task Management", key: "/tasks", icon: <CheckCircleOutlined /> },
    { label: "Logout", key: "logout", icon: <LogoutOutlined /> },
  ];

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
      <Header style={{ background: "#fff", padding: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={onMenuClick}
          style={{ flex: 1, justifyContent: "center" }}
        />
        <div style={{ paddingRight: 24, fontWeight: 500 }}>
          {role !== "Admin" && <>Discipline: {discipline} | </>}
          Role: {role}
        </div>
      </Header>
      <Content style={{ padding: "24px 48px" }}>
        {children}
      </Content>
    </Layout>
  );
};

export default PageLayout;
