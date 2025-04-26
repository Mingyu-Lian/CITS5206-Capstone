// src/pages/WMSViewTasksPage.jsx
import { useState } from "react";
import { Table, Button, Typography } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import mockLocomotives from "../../data/mockProjectData";

const { Title } = Typography;

const WMSViewTasksPage = () => {
  const { locomotiveId, wmsId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [tasks, setTasks] = useState(mockLocomotives);

  const columns = [
    { title: "Task Title", dataIndex: "title", key: "title" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/projects/${locomotiveId}/wms/${wmsId}/tasks/${record.id}/subtasks`)}>
          View Subtasks
        </Button>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="p-6 bg-white min-h-screen">
        <Title level={3}>Tasks for WMS: {wmsId} of Locomotive: {locomotiveId}</Title>
        <Table rowKey="id" columns={columns} dataSource={tasks} bordered />
      </div>
    </PageLayout>
  );
};

export default WMSViewTasksPage;
