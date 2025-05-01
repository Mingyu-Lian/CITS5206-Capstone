// src/pages/task/Taskdetail.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout, Tabs, Badge, Button, List, Typography } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import InstructionsTab from "./task-tabs/instruction-tab.jsx";
import NotesTab from "./task-tabs/notes-tab.jsx";
import UserPhotosTab from "./task-tabs/user-photos-tab.jsx";
import { useTaskDetail } from "../../hooks/useMockData"; // 👈 Import live hook
import "./Taskdetail.css";

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const Taskdetail = () => {
  const { locomotiveId, wmsId, taskId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("instructions");

  const { taskDetail, loading } = useTaskDetail(locomotiveId, wmsId, taskId);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <div>Loading Task Detail...</div>;

  return (
    <div className="taskdetail-container">
      <Layout style={{ borderRadius: 8, overflow: 'hidden', width: 'calc(100% - 8px)', height: '100%' }}>
        <Header style={{ backgroundColor: '#bf8c8c' }}>
          <div className="task-header">
            <div className="task-title">
              Task: {taskDetail?.title || taskId}
            </div>
            <div className="task-role">
              <span>Role:</span> Permit Officer
            </div>
          </div>
        </Header>

        <Layout>
          <Sider style={{ backgroundColor: '#807c7c', width: "10%" }}>
            <Tabs
              className="left-tabs"
              activeKey={activeTab}
              onChange={handleTabChange}
              tabPosition="left"
              type="card"
              items={[
                { key: "instructions", label: "Instructions" },
                { key: "components", label: "Components" },
                { key: "notes", label: <span>Notes <Badge count={0} showZero /></span> },
                { key: "userPhotos", label: <span>User Photos <Badge count={0} showZero /></span> },
              ]}
            />
          </Sider>

          <Content style={{ padding: 24, backgroundColor: '#2e2d2d', color: '#fff' }}>
            {activeTab === "instructions" && <InstructionsTab />}
            {activeTab === "components" && (
              <>
                <Title level={4} style={{ color: "#fff" }}>Subtasks</Title>
                <List
                  dataSource={taskDetail?.subtasks || []}
                  renderItem={(subtask) => (
                    <List.Item>
                      {subtask.title} — 
                      <Badge color={subtask.status === "Completed" ? "green" : subtask.status === "In Progress" ? "blue" : "orange"} text={subtask.status} />
                    </List.Item>
                  )}
                />
              </>
            )}
            {activeTab === "notes" && <NotesTab />}
            {activeTab === "userPhotos" && <UserPhotosTab />}
          </Content>
        </Layout>

        <Footer style={{ textAlign: 'center', backgroundColor: '#4096ff', color: '#fff' }}>
          <Button type="primary" onClick={handleBack} icon={<ArrowLeftOutlined />}>Back</Button>
        </Footer>
      </Layout>
    </div>
  );
};

export default Taskdetail;
