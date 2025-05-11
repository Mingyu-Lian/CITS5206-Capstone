import React, { useEffect, useState } from 'react';
import { Layout, Button, Tabs, Badge, Select, List, Typography, Image, Alert, Spin, Card } from 'antd';
import axios from "axios";
import InstructionsTab from "../TaskJson/task-tabs/instruction-tab.jsx"
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"

// import ComponentsTab from "./task-tabs/components-tab"
import NotesTab from "../TaskJson/task-tabs/notes-tab.jsx"
import UserPhotosTab from "../TaskJson/task-tabs/user-photos-tab.jsx"
import "./Taskdetail.css";
const { Header, Footer, Sider, Content } = Layout
// Mock API to fetch task data
const fetchTaskData = () => {
  return new Promise((resolve) => {
    import('./OneTask.json').then((data) => {
      resolve(data.default || data);
    });
  });
};
const parseInstructions = (instructionsRaw) => {
  // Split by lines and remove color codes
  return instructionsRaw
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => {
      // Remove color codes and [-]
      let clean = line.replace(/\[[^\]]*\]/g, '').replace(/\[-\]/g, '').trim();
      return clean.replace(/^\d+\.\s*/, '');
    });
};

const parseAlerts = (alertsRaw) => {
  // Remove color codes and bold tags
  return alertsRaw
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\[\/b\]/g, '')
    .replace(/\[b\]/g, '')
    .split(/\r?\n/)
    .filter((line) => line.trim());
};

const Taskdetail = () => {
  const { Option } = Select;
  const [activeTab, setActiveTab] = useState("instructions")
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [complete, setComplete] = useState(false);

  const [userName, setUserName] = useState(null);
  const [timeStamp, setTimeStamp] = useState(null);



  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  const handleCompleteButton = () => {
   const userName=localStorage.getItem("user")
   const timeStamp = new Date().toLocaleString()
    setComplete(true)
    setUserName(userName)
    setTimeStamp(timeStamp)
    console.log(complete)
    console.log("userName:", userName, timeStamp)
  }

  useEffect(() => {
    fetchTaskData().then((data) => {
      localStorage.setItem("userName", "Ross Richardson")
      setTask(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spin style={{ marginTop: 100 }} />;
  }
  if (!task) {
    return <Alert message="Task not found" type="error" />;
  }
  const instructions = parseInstructions(task.Instructions);
  const alerts = parseAlerts(task.Alerts);
  const headerStyle = {
    // textAlign: 'center',
    // color: '#fff',
    // height: 64,
    // paddingInline: 48,
    // lineHeight: '64px',
    backgroundColor: '#bf8c8c',
  };
  const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#2e2d2d',
  };
  const siderStyle = {
    // textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#807c7c',
    width: "10%",
    color: '#fff',


  };
  const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
  };
  const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: 'calc(100% - 8px)',
    maxWidth: 'calc(100% - 8px)',
    height: '100%',
  };
  return (
    <div className="taskdetail-container">
      <Layout style={layoutStyle}>
        <Header style={{ background: '#6d1919', color: '#fff', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 'bold', fontSize: 18 }}>
                {task.ItemNumber} {task.Title}
              </span>
              <span style={{ color: '#ffb300', marginLeft: 16 }}>Permit Officer</span>
            </div>
            <div style={{ color: '#7fff7f', fontSize: 14 }}>
              {complete ? `Completed by ${userName} on ${timeStamp}`:" "}
              <Button type="primary"
                style={{ marginLeft: 16, background: complete ? "#e0e0e0" : "#1677ff" }}

                disabled={complete}
                onClick={handleCompleteButton}>Set Complete </Button>
            </div>
          </div>
        </Header>
        <Layout>
          <Sider style={siderStyle}>
            <Tabs
              className="left-tabs"
              style={{ color: 'blue' }}
              activeKey={activeTab}
              onChange={handleTabChange}
              tabPosition="left"
              type="card"
              items={[
                {
                  key: "instructions",
                  label: "Instructions",
                  children: null,
                },
                {
                  key: "components",
                  label: "Components",
                  children: null,
                },
                {
                  key: "notes",
                  label: (
                    <span>
                      Notes <Badge count={alerts.length} showZero />
                    </span>
                  ),
                  children: null,
                },
                {
                  key: "userPhotos",
                  label: (
                    <span>
                      User Photos
                    </span>
                  ),
                  children: null,
                },
              ]}
            />
          </Sider>
          <Content style={contentStyle}>
            <div className="flex">
              <div className="flex-1 mr-4">
                {activeTab === "instructions" && <InstructionsTab instructionData={instructions} />}
                {/* {activeTab === "components" && <ComponentsTab />}*/}
                {activeTab === "notes" && <NotesTab noteAlert={alerts} />}
                {activeTab === "userPhotos" && <UserPhotosTab />}
              </div>
            </div>
          </Content>
        </Layout>
        <Footer className="task-footer">
          <Button type="primary" className="w-[120px] bg-[#d32f2f] hover:bg-[#b71c1c]" icon={<ArrowLeftOutlined />}>
            Previous
          </Button>

          <Button type="primary" className="w-[150px] bg-[#d32f2f] hover:bg-[#b71c1c]" icon={<ArrowLeftOutlined />}>
            Prev Permit Officer
          </Button>

          <Button type="primary" className="w-[150px] bg-[#d32f2f] hover:bg-[#b71c1c]" icon={<ArrowRightOutlined />}>
            Next Permit Officer
          </Button>

          <Button type="primary" className="w-[120px] bg-[#d32f2f] hover:bg-[#b71c1c]" icon={<ArrowRightOutlined />}>
            Next
          </Button>
        </Footer>    </Layout>
    </div >

  );
};
export default Taskdetail;
