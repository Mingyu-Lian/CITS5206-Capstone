import React, { useState } from "react";
import { Flex, Layout } from 'antd';
import axios from "axios";
import InstructionsTab from "./task-tabs/instruction-tab.jsx"
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"

// import ComponentsTab from "./task-tabs/components-tab"
import NotesTab from "./task-tabs/notes-tab"
import UserPhotosTab from "./task-tabs/user-photos-tab"
import { Button, Typography, Select, Tabs, Badge } from 'antd';
import "./Taskdetail.css";
const { Header, Footer, Sider, Content } = Layout
const Taskdetail = () => {
  const { Option } = Select;
  const [activeTab, setActiveTab] = useState("instructions")

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

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
        <Header style={headerStyle} className="">
          <div className="task-header">

            <div className="task-title">
              1.1 Sign on to permit of isolation and lock on
            </div>

            <div className="task-role">
              <span>Role:</span>
              Permit Officer
            </div>
            <div className="">Completed by Ross Richardson on 18-Feb-19 17:03</div>

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
                      User Photos <Badge count={0} showZero className="ml-1" />
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
                {/* {activeTab === "components" && <ComponentsTab />}*/}
                {activeTab === "notes" && <NotesTab />}
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
