// src/pages/TaskListPage.jsx
import { useState, useEffect } from "react";
import { Table, Button, Tag, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import localforage from "localforage";
import { getCachedLocomotiveData, cacheLocomotiveData } from "../utils/offlineSyncHelper";
import { message } from "antd";


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
        <Button type="link" onClick={() => navigate(`/tasks/${locomotiveId}/wms/${wmsId}/task/${record.taskId || record.id}`)}>
          View Subtasks
        </Button>
      ),
    },
  ];

  // Load tasks from online or offline cache
  const loadTasksData = async () => {

    const cachedLocoData = await getCachedLocomotiveData(locomotiveId);
  
    if (cachedLocoData) {
      const currentWMS = cachedLocoData.wmsList.find(wms => wms.wmsId === wmsId);
  
      if (currentWMS) {
        setData(currentWMS.tasks || []);
        message.info("Loaded tasks from cached WMS.");
      } else {
        setData([]);
        message.warning("WMS not found in cached data.");
      }
    } else if (navigator.onLine) {
      let defaultTasks;
      if (wmsId === "wms2" && locomotiveId === "Loco-001") {
        defaultTasks = [
          { id: "task3", title: "Inspect Brake System", status: "Pending", subtasks: [] },
          { id: "task4", title: "Replace Battery Module", status: "In Progress", subtasks: [] },
        ];
      } else {
        defaultTasks = [
          { id: "task1", title: "Check Fuse Box", status: "Pending", subtasks: [] },
          { id: "task2", title: "Install Cabling", status: "Signed Off", subtasks: [] },
        ];
      }
  
      const newLocoData = {
        locomotiveId,
        name: `Locomotive ${locomotiveId}`,
        baseline: "v1.0",
        wmsList: [
          {
            wmsId,
            title: `WMS - ${wmsId}`,
            type: "Default Type",
            tasks: defaultTasks,
          },
        ],
      };
  
      setData(defaultTasks);
      await cacheLocomotiveData(locomotiveId, newLocoData);
      message.success("Fetched online tasks data and cached.");
    } else {
      setData([]);
      message.warning("Offline and no cached data available.");
    }
  
    setLoading(false);
  };  
  
  useEffect(() => {
    loadTasksData();
  }, [wmsId, locomotiveId]);  

  if (loading) return <div>Loading Tasks...</div>;

  return (
      <div className="p-6 bg-white min-h-screen">
        <Title level={3}>Tasks for WMS: {wmsId}</Title>
        <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />
        <Table rowKey="id" columns={columns} dataSource={filtered} bordered />
      </div>
  );
};

export default TaskListPage;
