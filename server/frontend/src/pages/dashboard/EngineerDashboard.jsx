// src/pages/dashboard/EngineerDashboard.jsx
import DashboardLayout from "../../components/DashboardLayout";
import { Card, List, Tag, Button, Typography, Spin, Input, Row, Col, Select, Progress, message } from "antd";
import { useState, useEffect } from "react";
import { SyncOutlined, ToolOutlined } from "@ant-design/icons";
import { useLocomotives } from "../../hooks/useMockData";

const { Title } = Typography;
const { Option } = Select;

const EngineerDashboard = () => {
  const { locomotives, loading } = useLocomotives();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const engineerName = "Engineer A";

  const handleSync = () => {
    message.success("Tasks synced successfully!");
    fetchAssignedTasks();
  };

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

  const markAsCompleted = (taskId) => {
    const updatedTasks = assignedTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status: "Completed" };
      }
      return task;
    });
    setAssignedTasks(updatedTasks);
    message.success("Task marked as completed!");
  };

  useEffect(() => {
    if (!loading) {
      fetchAssignedTasks();
    }
  
    // ✅ Add event listener to detect assignment change
    const handleStorageChange = (event) => {
      if (event.key === "assignedTasks") {
        fetchAssignedTasks(); // Reload tasks automatically
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange); // Clean up
    };
  }, [loading]);
  

  if (loading) return <Spin tip="Loading Engineer Tasks..." size="large" style={{ marginTop: "20vh" }} />;

  // Apply filters
  const filteredTasks = assignedTasks.filter((task) => {
    const statusMatch = statusFilter === "All" || task.status === statusFilter;
    const searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Calculate Progress
  const totalTasks = assignedTasks.length;
  const completedTasks = assignedTasks.filter(task => task.status === "Completed").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <DashboardLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>Engineer Dashboard - {engineerName}</Title>

        {/* Filter Controls */}
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

        {/* Progress Overview */}
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

        {/* Task List */}
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
    </DashboardLayout>
  );
};

export default EngineerDashboard;
