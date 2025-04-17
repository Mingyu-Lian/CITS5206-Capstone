// src/pages/TaskListPage.jsx
import { useState } from "react";
import { Table, Button, Tag, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";

const { Title } = Typography;

const TaskListPage = () => {
  const { locomotiveId, wmsId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});

  const data = [
    { id: "task1", title: "Check Fuse Box", status: "Pending" },
    { id: "task2", title: "Install Cabling", status: "Signed Off" },
  ];

  const fields = [
    { label: "Title", key: "title", type: "text" },
    { label: "Status", key: "status", type: "select", options: ["Pending", "Signed Off"] },
  ];

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

  const filtered = data.filter((item) => {
    return (!filters.rules || filters.rules.every(r => {
      const val = item[r.field]?.toString().toLowerCase();
      const q = r.value.toString().toLowerCase();
      switch (r.operator) {
        case "Equal": return val === q;
        case "Contains": return val.includes(q);
        case "Starts With": return val.startsWith(q);
        default: return true;
      }
    }));
  });

  const columns = [
    { title: "Task", dataIndex: "title", key: "title" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Signed Off" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/tasks/${locomotiveId}/wms/${wmsId}/task/${record.id}`)}>
          View Subtasks
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      <Title level={3}>Tasks for WMS: {wmsId}</Title>
      <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />
      <Table rowKey="id" columns={columns} dataSource={filtered} bordered />
    </div>
  );
};

export default TaskListPage;
