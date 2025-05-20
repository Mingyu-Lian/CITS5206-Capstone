import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';

import { Layout, Button, Tabs, Badge, Select, List, Typography, Image, Alert, Spin, Card } from 'antd';
import axios from "axios";
import InstructionsTab from "../TaskJson/task-tabs/instruction-tab.jsx"
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"

import NotesTab from "../TaskJson/task-tabs/notes-tab.jsx"
import UserPhotosTab from "../TaskJson/task-tabs/user-photos-tab.jsx"
import ComponentsTab from "../TaskJson/task-tabs/component-tab.jsx"

import "./Taskdetail.css";
import Task1 from "./Task1.json";
// import Task2 from "./Task2.json"; 
import Tasks from "./Task.json";

const { Header, Footer, Sider, Content } = Layout
// Mock API to fetch task data
// const fetchTaskData = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 1000))
//   return Task[1]
// }
const fetchTaskData = (subtaskId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const task = Tasks[subtaskId];
      console.log("Test:", Tasks, Tasks[subtaskId])
      if (task) {
        resolve(task);
      } else {
        reject(new Error(`Task with subtaskId ${subtaskId} not found`));
      }
    }, 500); // Simulate network delay
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
const partComponents = (componentsRaw) => {
  // Split by lines and remove color codes
  return componentsRaw
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
  const [taskData, setTaskData] = useState(null);
  const [error, setError] = useState(null);
  const [complete, setComplete] = useState(false);
  const [userName, setUserName] = useState(null);
  const [timeStamp, setTimeStamp] = useState(null);
  

  //"/taskjson/:subtaskId"
  const { subtaskId } = useParams();

  console.log("subtaskId", subtaskId)
  const navigate = useNavigate();

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  const handleCompleteButton = () => {
    const userName = localStorage.getItem("name");
    const timeStamp = new Date().toLocaleString()
    setComplete(true)
    setUserName(userName)
    setTimeStamp(timeStamp)
    console.log(complete)
    console.log("userName:", userName, timeStamp)
  }

  useEffect(() => {

    // fetchTaskData().then((data) => {
    //   localStorage.setItem("name", "Ross Richardson")
    //   const currentUser = localStorage.getItem("name");

    //   setTask(data);
    //   setLoading(false);
    // });
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTaskData(subtaskId);
        setTaskData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [subtaskId]);
  const handleNavigation = (direction) => {
    const currentId = parseInt(subtaskId);
    const newId = direction === 'next' ? currentId + 1 : currentId - 1;

    // Disable navigation beyond available data
    if (newId in Tasks) {
      navigate(`/taskjson/${newId}`);
    }
  };

  if (loading) {
    return <Spin style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} size="large" tip="Loading Task..." />;
  }
  if (!taskData) {
    return <Alert message="Task not found" type="error" />;
  }
  const instructions = parseInstructions(taskData.Instructions);
  const alerts = parseAlerts(taskData.Alerts);
  const components = partComponents(taskData.Components)
  console.log("components:", components)
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
                {taskData.ItemNumber} {taskData.Title}
              </span>
              <span style={{ color: '#ffb300', marginLeft: 16 }}>Permit Officer</span>
            </div>
            <div style={{ color: '#7fff7f', fontSize: 14 }}>
              {complete ? `Completed by ${userName} on ${timeStamp}` : " "}
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
                {activeTab === "instructions" && <InstructionsTab instructionData={instructions}/>}
                {activeTab === "components" && <ComponentsTab components={components} />}
                {activeTab === "notes" && <NotesTab noteAlert={alerts} />}
                {activeTab === "userPhotos" && <UserPhotosTab />}
              </div>
            </div>
          </Content>
        </Layout>
        <Footer className="task-footer">
          <Button  id = "previous_task"type="primary" className="w-[120px] bg-[#d32f2f] hover:bg-[#b71c1c]" icon={<ArrowLeftOutlined />} onClick={() => handleNavigation('prev')}
            disabled={parseInt(subtaskId) <= 1}>
            Previous
          </Button>

          <Button type="primary" className="w-[150px] bg-[#d32f2f] hover:bg-[#b71c1c]" icon={<ArrowLeftOutlined />} onClick={() => handleNavigation('prev')}
            disabled={parseInt(subtaskId) <= 1}>
            Prev Permit Officer
          </Button>

          <Button type="primary" className="w-[150px] bg-[#d32f2f] hover:bg-[#b71c1c]" icon={<ArrowRightOutlined />} onClick={() => handleNavigation('next')}  disabled={!Tasks[parseInt(subtaskId) + 1]}>
            Next Permit Officer
          </Button>

          <Button id = "next_task"type="primary" className="w-[120px] bg-[#d32f2f] hover:bg-[#b71c1c]" icon={<ArrowRightOutlined />} onClick={() => handleNavigation('next')}
            disabled={!Tasks[parseInt(subtaskId) + 1]}>
            Next
          </Button>
        </Footer>    </Layout>
    </div >

  );
};
export default Taskdetail;
