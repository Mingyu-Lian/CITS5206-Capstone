// src/pages/dashboard/EngineerDashboard.jsx
import { Card, List, Tag, Button, Typography, Spin, Input, Row, Col, Select, Progress, message } from "antd";
import { SyncOutlined, ToolOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useLocomotives } from "../../hooks/useMockData";
import localforage from "localforage";
import { syncLogs, getCachedLocomotiveData, cacheLocomotiveData } from "../../utils/offlineSyncHelper";
import users from "../../mock/mockUsers";
import useNetworkStatus from "../../utils/useNetworkStatus";
import { defaultLocomotiveData } from "../../mock/mockEngineerTasks";

const { Title } = Typography;
const { Option } = Select;

const userId = localStorage.getItem("userId") || "unknown";
const LOG_KEY = `offlineLogs-${userId}`;
const currentUser = users.find(u => u.id === userId);
const engineerName = currentUser?.name || "Unknown Engineer";

const EngineerDashboard = () => {
  const online = useNetworkStatus();
  const { locomotives, loading } = useLocomotives();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [pendingSubtasks, setPendingSubtasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const autoCacheAllLocos = async () => {
      if (!online) return;

      const locoIds = ["Loco-001", "Loco-002", "Loco-003", "Loco-004"];

      for (const locoId of locoIds) {
        const existing = await getCachedLocomotiveData(locoId);
        if (existing) continue;

        const defaultData = defaultLocomotiveData(locoId);
        await cacheLocomotiveData(locoId, defaultData);
      }
    };

    autoCacheAllLocos();
  }, [online]);

  const fetchAssignedTasks = () => {
    const assigned = [];
    const assignedEngineers = JSON.parse(localStorage.getItem("assignedTasks") || "{}");
    locomotives.forEach((loco) => {
      loco.wmsList.forEach((wms) => {
        wms.tasks.forEach((task) => {
          const assignedEngineer = assignedEngineers[`${loco.locomotiveId}-${wms.wmsId}-${task.taskId}`];
          if (assignedEngineer === engineerName) {
            assigned.push({
              id: `${loco.locomotiveId}-${wms.wmsId}-${task.taskId}`,
              title: `${task.title} (${loco.name})`,
              status: task.status,
            });
          }
        });
      });
    });
    setAssignedTasks(assigned);
  };

  const loadUserCachedTaskList = async () => {
    try {
      const cachedTasks = await localforage.getItem(`offlineTaskList-${userId}`);
      if (cachedTasks && Array.isArray(cachedTasks)) {
        setAssignedTasks(cachedTasks);
        console.log("Loaded cached task list from localForage");
      }
    } catch (error) {
      console.error("Failed to load cached task list:", error);
    }
  };

  const fetchPendingSubtasks = async () => {
    const allLogs = (await localforage.getItem(LOG_KEY)) || [];
    const pendingLogs = allLogs.filter((log) => log.status === "pending");

    const uniqueSubtaskIds = [...new Set(
      pendingLogs.map((log) => {
        try {
          const detail = JSON.parse(log.details);
          return detail.subtaskId;
        } catch {
          return null;
        }
      }).filter(id => id)
    )];

    setPendingSubtasks(uniqueSubtaskIds);
  };

  const handleSync = async () => {
    await syncLogs();
    message.success("Logs synced successfully.");
    fetchPendingSubtasks();
    fetchAssignedTasks();
  };

  const markAsCompleted = (taskId) => {
    const updatedTasks = assignedTasks.map(task =>
      task.id === taskId ? { ...task, status: "Completed" } : task
    );
    setAssignedTasks(updatedTasks);
    message.success("Task marked as completed!");
  };

  useEffect(() => {
    if (!loading) {
      fetchAssignedTasks();
    }
    fetchPendingSubtasks();
    loadUserCachedTaskList();

    const handleStorageChange = (event) => {
      if (event.key === "assignedTasks") fetchAssignedTasks();
    };

    const handleOnline = () => {
      if (pendingSubtasks.length > 0) {
        message.info("You have unsynced subtasks. Please click Sync to upload.");
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchPendingSubtasks();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [loading, pendingSubtasks]);

  if (loading) {
    return <Spin tip="Loading Engineer Tasks..." size="large" style={{ marginTop: "20vh" }} />;
  }

  const filteredTasks = assignedTasks.filter((task) => {
    const statusMatch = statusFilter === "All" || task.status === statusFilter;
    const searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const totalTasks = assignedTasks.length;
  const completedTasks = assignedTasks.filter(task => task.status === "Completed").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Engineer Dashboard - {engineerName}</Title>

      <Card
        title={<><ToolOutlined /> Pending Subtasks (Offline)</>}
        extra={<Button type="primary" icon={<SyncOutlined />} onClick={handleSync}>Sync</Button>}
        style={{ marginBottom: 24 }}
      >
        {pendingSubtasks.length === 0 ? (
          <p>No pending subtasks. All changes are synced.</p>
        ) : (
          <List
            dataSource={pendingSubtasks}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={`Subtask ID: ${item}`} />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Select
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            style={{ width: "100%" }}
            placeholder="Filter by Status"
          >
            <Option value="All">All Statuses</Option>
            <Option value="Pending">Pending</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </Col>

        <Col xs={24} md={8}>
          <Input.Search
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Task Title"
            allowClear
          />
        </Col>

        <Col xs={24} md={8}>
          <Button type="primary" icon={<SyncOutlined />} onClick={handleSync} block>
            Sync Tasks
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Completion Progress">
            <Progress percent={progressPercent} status="active" />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Overall Progress">
            <Progress type="circle" percent={progressPercent} />
          </Card>
        </Col>
      </Row>

      <Card title={<><ToolOutlined /> Your Assigned Tasks</>}>
        <List
          dataSource={filteredTasks}
          renderItem={(task) => (
            <List.Item
              actions={
                task.status === "In Progress"
                  ? [
                      <Button type="link" onClick={() => markAsCompleted(task.id)}>
                        Mark Completed
                      </Button>
                    ]
                  : []
              }
            >
              <List.Item.Meta
                title={task.title}
                description={<Tag color={task.status === "Completed" ? "green" : "blue"}>{task.status}</Tag>}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default EngineerDashboard;
