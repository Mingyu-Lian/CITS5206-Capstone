// src/pages/TaskListPage.jsx
import { useState, useEffect } from "react";
import { Table, Button, Tag, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
<<<<<<< HEAD
import localforage from "localforage";
=======
import PageLayout from "../components/PageLayout";
import { useTasks } from "../hooks/useMockData"; // ✅ Hook
>>>>>>> origin/main

const { Title } = Typography;

const TaskListPage = () => {
  const { locomotiveId, wmsId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
<<<<<<< HEAD
  const [data, setData] = useState([]);
=======
  const { tasks, loading } = useTasks(locomotiveId, wmsId);
>>>>>>> origin/main

  const fields = [
    { label: "Title", key: "title", type: "text" },
    { label: "Status", key: "status", type: "select", options: ["Pending", "In Progress", "Completed", "Signed Off"] },
  ];

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

  const filtered = tasks.filter((item) => {
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
        <Button type="link" onClick={() => navigate(`/tasks/${locomotiveId}/wms/${wmsId}/task/${record.taskId}`)}>
          View Subtasks
        </Button>
      ),
    },
  ];

<<<<<<< HEAD
  useEffect(() => {
    loadTasksData();
  }, [wmsId]);

  const loadTasksData = async () => {
    const offlineKey = `offlineTaskList-${wmsId}`;

    if (navigator.onLine) {
      // Online: load and cache fresh data
      const onlineData = [
        { id: "task1", title: "Check Fuse Box", status: "Pending" },
        { id: "task2", title: "Install Cabling", status: "Signed Off" },
      ];

      setData(onlineData);
      await localforage.setItem(offlineKey, onlineData);
    } else {
      // Offline: load from cache silently
      const cachedData = await localforage.getItem(offlineKey);
      if (cachedData) {
        setData(cachedData);
      }
    }
  };
=======
  if (loading) return <div>Loading Tasks...</div>;
>>>>>>> origin/main

  return (
    <PageLayout>
      <div className="p-6 bg-white min-h-screen">
        <Title level={3}>Tasks for WMS: {wmsId}</Title>
        <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />
        <Table rowKey="taskId" columns={columns} dataSource={filtered} bordered />
      </div>
    </PageLayout>
  );
};

export default TaskListPage;