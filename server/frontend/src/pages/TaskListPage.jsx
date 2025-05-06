// src/pages/TaskListPage.jsx
import { useState, useEffect } from "react";
import { Table, Button, Tag, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import PageLayout from "../components/PageLayout";
import localforage from "localforage";

const { Title } = Typography;

const TaskListPage = () => {
  const { locomotiveId, wmsId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fields = [
    { label: "Title", key: "title", type: "text" },
    { label: "Status", key: "status", type: "select", options: ["Pending", "In Progress", "Completed", "Signed Off"] },
  ];

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

  // Filter data based on search query
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
        <Tag color={status === "Completed" ? "blue" : status === "Signed Off" ? "green" : "orange"}>
          {status}
        </Tag>
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

  // Load tasks from online or offline cache
  const loadTasksData = async () => {
    const offlineKey = `offlineTaskList-${wmsId}`;
    if (navigator.onLine) {
      // Simulate online task data
      const onlineData = [
        { id: "task1", title: "Check Fuse Box", status: "Pending" },
        { id: "task2", title: "Install Cabling", status: "Signed Off" },
      ];
      setData(onlineData);
      await localforage.setItem(offlineKey, onlineData);
    } else {
      // Load from offline cache
      const cachedData = await localforage.getItem(offlineKey);
      if (cachedData) {
        setData(cachedData);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasksData();
  }, [wmsId]);

  if (loading) return <div>Loading Tasks...</div>;

  return (
    <PageLayout>
      <div className="p-6 bg-white min-h-screen">
        <Title level={3}>Tasks for WMS: {wmsId}</Title>
        <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />
        <Table rowKey="id" columns={columns} dataSource={filtered} bordered />
      </div>
    </PageLayout>
  );
};

export default TaskListPage;
