import { Card, List, Tag, Typography } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";


const tasks = [
  { title: "Assign task to Engineer A", status: "Pending" },
  { title: "Review Loco B progress", status: "In Progress" },
];

const statusColors = {
  Pending: "orange",
  "In Progress": "blue",
  Completed: "green",
};

const SupervisorDashboard = () => {
  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Supervisor Dashboard</Typography.Title>

      <Card title="Your Supervision Tasks">
        <List
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item>
              <List.Item.Meta
                title={task.title}
                description={
                  <Tag color={statusColors[task.status] || "default"}>
                    {task.status}
                  </Tag>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default SupervisorDashboard;
