import DashboardLayout from "../../components/DashboardLayout";
import {
  Card, List, Tag, Button, Typography, Spin, Input, Row, Col,
  Select, Progress, message, Checkbox, Tooltip
} from "antd";
import { useState, useEffect } from "react";
import { SyncOutlined, ToolOutlined } from "@ant-design/icons";
import { useLocomotives } from "../../hooks/useMockData";
import {
  fetchTaskSignOffs,
  toggleTaskSignOff,
  fetchAssignedEngineers
} from "../../mock/mockApi";

const { Title } = Typography;
const { Option } = Select;

const EngineerDashboard = () => {
  const { locomotives, loading } = useLocomotives();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [signOffs, setSignOffs] = useState({});
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const engineerName = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const discipline = localStorage.getItem("discipline");

  useEffect(() => {
    let isMounted = true;

    const loadAssignments = async () => {
      const rawSignOffs = await fetchTaskSignOffs();
      if (!isMounted) return;
      setSignOffs(rawSignOffs);

      const tasks = [];

      for (const loco of locomotives) {
        for (const wms of loco.wmsList) {
          for (const task of wms.tasks) {
            const taskId = `${loco.locomotiveId}-${wms.wmsId}-${task.taskId}`;
            const assigned = await fetchAssignedEngineers(taskId);
            const isAssigned = assigned.some((eng) => eng.name === engineerName);
            if (isAssigned) {
              tasks.push({
                id: taskId,
                taskId: task.taskId,
                title: `${task.title} (${loco.name})`,
                status: task.status,
                discipline: task.discipline
              });
            }
          }
        }
      }

      if (isMounted) setAssignedTasks(tasks);
    };

    if (!loading) {
      loadAssignments();
      const interval = setInterval(loadAssignments, 3000);
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [loading, locomotives, engineerName]);

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
  const completed = assignedTasks.filter((task) => task.status === "Completed").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <DashboardLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>Engineer Dashboard - {engineerName}</Title>

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
            <Button icon={<SyncOutlined />} onClick={() => window.location.reload()} block>
              Sync
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title="Completion Progress">
              <Progress percent={progress} status="active" />
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Overview">
              <Progress type="circle" percent={progress} />
            </Card>
          </Col>
        </Row>

        <Card title={<><ToolOutlined /> Assigned Tasks</>}>
          <List
            dataSource={filteredTasks}
            renderItem={(task) => {
              const key = `${task.taskId}-${engineerName}`;
              const canSignOff =
                role === "Admin" ||
                task.discipline?.toLowerCase() === discipline?.toLowerCase();

              return (
                <List.Item
                  actions={[
                    <Tooltip title={canSignOff ? "Sign off" : "Discipline mismatch"}>
                      <Checkbox
                        checked={signOffs[key]}
                        disabled={!canSignOff}
                        onChange={() => handleSignOffToggle(task.taskId)}
                      >
                        Sign-Off
                      </Checkbox>
                    </Tooltip>
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
    </DashboardLayout>
  );
};

export default EngineerDashboard;
