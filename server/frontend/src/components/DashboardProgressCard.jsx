// src/components/DashboardProgressCard.jsx
import { Card, Progress, Typography } from "antd";
import { useLocomotives } from "../hooks/useMockData";

const { Title } = Typography;

const DashboardProgressCard = () => {
  const { locomotives, loading } = useLocomotives();

  if (loading) return <Card loading />;

  let totalTasks = 0;
  let completed = 0;
  let inProgress = 0;
  let pending = 0;
  let signedOff = 0;

  locomotives.forEach((locomotive) => {
    locomotive.wmsList.forEach((wms) => {
      wms.tasks.forEach((task) => {
        totalTasks++;
        switch (task.status) {
          case "Completed":
            completed++;
            break;
          case "In Progress":
            inProgress++;
            break;
          case "Pending":
            pending++;
            break;
          case "Signed Off":
            signedOff++;
            break;
          default:
            break;
        }
      });
    });
  });

  return (
    <Card title="Task Progress Overview" style={{ marginTop: 24 }}>
      <Title level={5}>Completed</Title>
      <Progress percent={Math.round((completed / totalTasks) * 100)} status="active" strokeColor="#3b82f6" />

      <Title level={5} style={{ marginTop: 16 }}>In Progress</Title>
      <Progress percent={Math.round((inProgress / totalTasks) * 100)} status="active" strokeColor="#f59e0b" />

      <Title level={5} style={{ marginTop: 16 }}>Pending</Title>
      <Progress percent={Math.round((pending / totalTasks) * 100)} status="active" strokeColor="#ef4444" />

      <Title level={5} style={{ marginTop: 16 }}>Signed Off</Title>
      <Progress percent={Math.round((signedOff / totalTasks) * 100)} status="active" strokeColor="#10b981" />
    </Card>
  );
};

export default DashboardProgressCard;
