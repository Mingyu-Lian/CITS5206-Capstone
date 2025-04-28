import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout, Tabs, Badge, Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import InstructionsTab from "./task-tabs/instruction-tab.jsx";
import NotesTab from "./task-tabs/notes-tab.jsx";
import UserPhotosTab from "./task-tabs/user-photos-tab.jsx";
import "./Taskdetail.css";


const { Header, Footer, Sider, Content } = Layout;

const Taskdetail = () => {
  const { subtaskId } = useParams();      // ✨ get subtaskId from URL
  const navigate = useNavigate();         // ✨ for "Back" button
  const [activeTab, setActiveTab] = useState("instructions");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleBack = () => {
    navigate(-1); // go back to previous page
  };

  const headerStyle = {
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
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#807c7c',
    width: "10%",
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
        <Header style={headerStyle}>
          <div className="task-header">
            <div className="task-title">
              Subtask: {subtaskId} {/* ✨ show the subtask ID dynamically */}
            </div>

            <div className="task-role">
              <span>Role:</span> Permit Officer {/* Hardcoded for now */}
            </div>
            <div>Completed by Ross Richardson on 18-Feb-19 17:03</div> {/* Hardcoded for now */}
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
                      Notes <Badge count={0} showZero />
                    </span>
                  ),
                  children: null,
                },
                {
                  key: "userPhotos",
                  label: (
                    <span>
                      User Photos <Badge count={0} showZero />
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
                {activeTab === "instructions" && <InstructionsTab />}
                {/* {activeTab === "components" && <ComponentsTab />} */}
                {activeTab === "notes" && <NotesTab />}
                {activeTab === "userPhotos" && <UserPhotosTab />}
              </div>
            </div>
          </Content>
        </Layout>

        <Footer className="task-footer">
          <Button 
            type="primary" 
            onClick={handleBack} 
            className="w-[120px] bg-[#d32f2f] hover:bg-[#b71c1c]" 
            icon={<ArrowLeftOutlined />}
          >
            Back
          </Button>

          <Button 
            type="primary" 
            className="w-[150px] bg-[#d32f2f] hover:bg-[#b71c1c]" 
            icon={<ArrowLeftOutlined />}
          >
            Prev Permit Officer
          </Button>

          <Button 
            type="primary" 
            className="w-[150px] bg-[#d32f2f] hover:bg-[#b71c1c]" 
            icon={<ArrowRightOutlined />}
          >
            Next Permit Officer
          </Button>

          <Button 
            type="primary" 
            className="w-[120px] bg-[#d32f2f] hover:bg-[#b71c1c]" 
            icon={<ArrowRightOutlined />}
          >
            Next
          </Button>
        </Footer>
      </Layout>
    </div>
  );
};

export default Taskdetail;
