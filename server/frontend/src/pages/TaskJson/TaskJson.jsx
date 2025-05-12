// ✅ TaskJson.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Layout, Button, Tabs, Badge, Typography, Alert, Spin
} from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

import InstructionsTab from "./task-tabs/instruction-tab.jsx";
import NotesTab from "./task-tabs/notes-tab.jsx";
import UserPhotosTab from "./task-tabs/user-photos-tab.jsx";
import ComponentsTab from "./task-tabs/component-tab.jsx";

import "./Taskdetail.css";
import Tasks from "./Task.json";

const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography;

const fetchTaskData = (taskId) => {
  const numericKey = parseInt(taskId.replace(/\D/g, ""), 10).toString();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = Tasks[numericKey];
      if (task) resolve(task);
      else reject(new Error(`Task with ID ${numericKey} not found`));
    }, 500);
  });
};

const parseList = (raw) =>
  raw?.split(/\r?\n/).filter(Boolean).map(line =>
    line.replace(/\[[^\]]*\]/g, '').replace(/\[-\]/g, '').replace(/^\d+\.\s*/, '').trim()
  );

const parseAlerts = (raw) =>
  raw?.replace(/\[[^\]]*\]/g, '').replace(/\[\/?b\]/g, '').split(/\r?\n/).filter(Boolean);

const TaskJson = () => {
  const { taskId } = useParams();
  const [activeTab, setActiveTab] = useState("instructions");
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState(null);
  const [complete, setComplete] = useState(false);
  const [userName, setUserName] = useState(null);
  const [timeStamp, setTimeStamp] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchTaskData(taskId);
        setTaskData(data);
      } catch (err) {
        console.error("❌ Task load error:", err.message);
        setTaskData(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [taskId]);

  const instructions = parseList(taskData?.Instructions || "").map((text, index) => ({ id: index + 1, text }));
  const components = parseList(taskData?.Components || "");
  const alerts = parseAlerts(taskData?.Alerts || "");

  const handleComplete = () => {
    const name = localStorage.getItem("name") || "Unknown";
    setComplete(true);
    setUserName(name);
    setTimeStamp(new Date().toLocaleString());
  };

  if (loading) return <Spin style={{ marginTop: 100 }} tip="Loading Task..." />;
  if (!taskData) return <Alert message="Task not found" type="error" showIcon style={{ margin: 24 }} />;

  return (
    <div className="taskdetail-container">
      <Layout style={{ borderRadius: 8, overflow: 'hidden', height: '100%' }}>
        <Header style={{ background: '#6d1919', color: '#fff', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 'bold', fontSize: 18 }}>
                {taskData.ItemNumber} {taskData.Title}
              </span>
              <span style={{ color: '#ffb300', marginLeft: 16 }}>Permit Officer</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Button onClick={() => window.history.back()} icon={<ArrowLeftOutlined />}>Back</Button>
              <Button
                type="primary"
                style={{ background: complete ? "#e0e0e0" : "#1677ff" }}
                disabled={complete}
                onClick={handleComplete}
              >
                {complete ? "Completed" : "Set Complete"}
              </Button>
              {complete && (
                <span style={{ color: "#7fff7f", fontSize: 14 }}>
                  by {userName} on {timeStamp}
                </span>
              )}
            </div>
          </div>
        </Header>

        <Layout>
          <Sider width="15%" style={{ backgroundColor: '#807c7c', color: '#fff' }}>
            <Tabs
              tabPosition="left"
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              items={[
                { key: "instructions", label: "Instructions" },
                { key: "components", label: "Components" },
                { key: "notes", label: <span>Notes <Badge count={alerts.length} showZero /></span> },
                { key: "userPhotos", label: "User Photos" },
              ]}
            />
          </Sider>

          <Content style={{ backgroundColor: '#2e2d2d', color: '#fff', padding: '16px' }}>
            {activeTab === "instructions" && <InstructionsTab instructionData={instructions} />}
            {activeTab === "components" && <ComponentsTab components={components} />}
            {activeTab === "notes" && <NotesTab noteAlert={alerts} />}
            {activeTab === "userPhotos" && <UserPhotosTab />}
          </Content>
        </Layout>

        <Footer className="task-footer">
          <Button icon={<ArrowLeftOutlined />} disabled>
            Previous
          </Button>
          <Button icon={<ArrowRightOutlined />} disabled>
            Next
          </Button>
        </Footer>
      </Layout>
    </div>
  );
};

export default TaskJson;