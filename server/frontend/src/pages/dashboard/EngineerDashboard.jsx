import DashboardLayout from "../../components/DashboardLayout";
import { Card, List, Tag, Button, Typography, message } from "antd";
import { SyncOutlined, ToolOutlined } from "@ant-design/icons";

const tasks = JSON.parse(localStorage.getItem("offlineTasks") || "[]");

const EngineerDashboard = () => {
  const handleSync = () => {
    console.log("Syncing offline tasks...");
    message.success("Offline tasks synced!");
  };

  return (
    <DashboardLayout>

    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Engineer Dashboard</Typography.Title>

      <Card
        title={<><ToolOutlined /> Offline Task List</>}
        extra={<Button type="primary" icon={<SyncOutlined />} onClick={handleSync}>Sync</Button>}
      >
        <List
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item>
              <List.Item.Meta
                title={task.title}
                description={<Tag color="processing">{task.status}</Tag>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
    </DashboardLayout>
  );
};

export default EngineerDashboard;
