import DashboardLayout from "../../components/DashboardLayout";
import {
  Card, List, Tag, Button, Typography, Spin, Input, Row, Col,
  Select, Progress, message, Checkbox, Tooltip
} from "antd";
import { useState, useEffect } from "react";
import { SyncOutlined, ToolOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useLocomotives } from "../../hooks/useMockData";
import {
  fetchTaskSignOffs,
  toggleTaskSignOff
} from "../../mock/mockApi";

const { Title } = Typography;
const { Option } = Select;
const userId = localStorage.getItem("userId") || "unknown";
const LOG_KEY = `offlineLogs-${userId}`;

const EngineerDashboard = () => {
  const { locomotives, loading } = useLocomotives();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [signOffs, setSignOffs] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const engineerName = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const discipline = localStorage.getItem("discipline");

  const loadAssignments = async () => {
    const rawSignOffs = await fetchTaskSignOffs();
    setSignOffs(rawSignOffs);

    const tasks = [];
    const assignedMap = JSON.parse(localStorage.getItem("assignedTasks") || "{}");

    for (const loco of locomotives) {
      for (const wms of loco.wmsList) {
        for (const task of wms.tasks) {
          const taskId = `${loco.locomotiveId}-${wms.wmsId}-${task.taskId}`;
          const assignedList = Array.isArray(assignedMap[taskId]) ? assignedMap[taskId] : [];
          const match = assignedList.find((e) => e.name === engineerName);

          if (match) {
            tasks.push({
              id: taskId,
              taskId: task.taskId,
              title: `${task.title} (${loco.name})`,
              status: task.status,
              assignedDiscipline: match.discipline
            });
          }
        }
      }
    }

    setAssignedTasks(tasks);
  };

  // Load data and bind event listeners
  useEffect(() => {
    if (!loading) {
      loadAssignments(); // Initial
      const interval = setInterval(loadAssignments, 5000); // Auto refresh
      return () => clearInterval(interval);
    }
  }, [loading, locomotives]);

  const handleSignOffToggle = async (taskId) => {
    const updated = await toggleTaskSignOff(taskId, engineerName);
    setSignOffs((prev) => ({ ...prev, [`${taskId}-${engineerName}`]: updated }));
    message.success(`Task ${updated ? "signed off" : "un-signed"}`);
  };

  const filteredTasks = assignedTasks.filter((task) => {
    const statusMatch = statusFilter === "All" || task.status === statusFilter;
    const searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const total = assignedTasks.length;
  const completed = assignedTasks.filter((task) => {
    const key = `${task.id}-${engineerName}`;
    return signOffs[key];
  }).length;

  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (loading) return <Spin tip="Loading Engineer Dashboard..." size="large" style={{ marginTop: "20vh" }} />;

  return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Engineer Dashboard – {engineerName}</Title>

        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: "100%" }}>
              <Option value="All">All</Option>
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Input.Search
              placeholder="Search Task Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Button icon={<SyncOutlined />} onClick={loadAssignments} block>
              Sync Tasks
            </Button>
          </Col>
        </Row>

        {/* Progress Summary */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <Card title="Completion Progress">
              <Progress percent={progress} status="active" />
              <div style={{ marginTop: 8 }}>{completed} of {total} tasks signed off</div>
            </Card>
          </Col>
        </Row>


        {/* Task List */}
        <Card title={<><ToolOutlined /> Your Assigned Tasks</>}>
          <List
            dataSource={filteredTasks}
            renderItem={(task) => {
              const key = `${task.id}-${engineerName}`;
              const canSignOff =
                role === "Admin" ||
                task.assignedDiscipline?.toLowerCase() === discipline?.toLowerCase();

              return (
                <List.Item
                  actions={[
                    <Tooltip title={canSignOff ? "Click to sign off" : "Discipline mismatch"}>
                      <Checkbox
                        checked={signOffs[key]}
                        disabled={!canSignOff}
                        onChange={() => handleSignOffToggle(task.id)}
                      >
                        Sign-Off
                      </Checkbox>
                    </Tooltip>,
                    <Button
                      size="small"
                      icon={<SyncOutlined />}
                      onClick={() => message.info("Sync logic pending")}
                    >
                      Sync Task
                    </Button>,
                    <Button
                      size="small"
                      type="link"
                      onClick={() => {
                        const [locoId, wmsId, taskOnlyId] = task.id.split("-");
                        window.location.href = `/taskdetail/${locoId}/${wmsId}/${taskOnlyId}`;
                      }}
                    >
                      View Details
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={task.title}
                    description={
                      <Tag color={task.status === "Completed" ? "green" : "blue"}>
                        {task.status}
                      </Tag>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      </div>
  );
};

export default EngineerDashboard;
