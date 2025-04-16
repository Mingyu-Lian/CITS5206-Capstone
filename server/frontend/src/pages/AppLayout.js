import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  ProjectOutlined,
  DashboardOutlined,
  AuditOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Avatar, Image, Dropdown } from 'antd';

import { Button, Layout, Menu, theme } from 'antd';
const { Header, Sider, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
            },
            {
              key: 'user',
              icon: <UserOutlined />,
              label: 'Users',
            },
            {
              key: 'project',
              icon: <ProjectOutlined />,
              label: 'Project',
            },
            {
              key: 'task',
              icon: <AuditOutlined />,
              label: 'Task',
            },
          ]}
        />
        {/* <Menu>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="/profile">
              个人资料
            </a>
          </Menu.Item>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="/settings">
              设置
            </a>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item>
            <a href="/logout">登出</a>
          </Menu.Item>
        </Menu> */}
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown 
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'logout',
                },
              ],
            }}
          >
            <Avatar style={{ float: 'right', marginTop: '20px', marginRight: '20px', alignItems:"center", color: '#f56a00', backgroundColor: '#fde3cf' }}>A


            </Avatar>
          </Dropdown>


        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;