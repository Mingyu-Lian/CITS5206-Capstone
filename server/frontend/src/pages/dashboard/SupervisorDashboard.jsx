import DashboardLayout from "../../components/DashboardLayout";
import {
  Card, List, Tag, Typography, Select, Input, Row, Col,
  Spin, Button, Modal, Form, message, Tooltip
} from "antd";
import { TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useLocomotives } from "../../hooks/useMockData";
import users from "../../mock/mockUsers";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option, OptGroup } = Select;

const statusColors = {
  Pending: "orange",
  "In Progress": "blue",
  Completed: "green",
  "Signed Off": "green",
};

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { locomotives, loading } = useLocomotives();
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLocomotive, setSelectedLocomotive] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignedEngineers, setAssignedEngineers] = useState({});
  const [form] = Form.useForm();

  const engineers = users.filter((u) => u.role === "Engineer");

  useEffect(() => {
    const storedAssignments = JSON.parse(localStorage.getItem("assignedTasks") || "{}");
    setAssignedEngineers(storedAssignments);
  }, []);

  useEffect(() => {
    if (!loading) {
      const tasks = [];
      locomotives.forEach((loco) => {
        loco.wmsList.forEach((wms) => {
          wms.tasks.forEach((task) => {
            tasks.push({
              id: `${loco.locomotiveId}-${wms.wmsId}-${task.taskId}`,
              taskId: task.taskId,
              type: wms.type, // <-- this is the key
              title: `${task.title} (${loco.name})`,
              status: task.status,
              locomotive: loco.name,
              discipline: task.discipline,
            });

          });
        });
      });
      setAllTasks(tasks);
    }
  }, [loading, locomotives]);

  useEffect(() => {
    const filtered = allTasks.filter((task) => {
      return (
        (selectedStatus === "All" || task.status === selectedStatus) &&
        (selectedLocomotive === "All" || task.locomotive === selectedLocomotive) &&
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredTasks(filtered);
  }, [allTasks, selectedStatus, selectedLocomotive, searchTerm]);

  const openAssignModal = (task) => {
    setSelectedTask(task);
    form.resetFields();
    setAssignModalVisible(true);
  };

  // ✅ FIXED handleAssign function
  const handleAssign = ({ engineer, discipline }) => {
    const taskId = selectedTask.id;
    let updated;

    try {
      updated = JSON.parse(localStorage.getItem("assignedTasks") || "{}");
      if (typeof updated !== "object" || Array.isArray(updated)) {
        updated = {};
      }
    } catch (e) {
      updated = {};
    }

    if (!Array.isArray(updated[taskId])) {
      updated[taskId] = [];
    }

    const alreadyAssigned = updated[taskId].some((e) => e.name === engineer);
    if (alreadyAssigned) {
      return message.warning(`${engineer} already assigned.`);
    }

    updated[taskId].push({ name: engineer, discipline });

    localStorage.setItem("assignedTasks", JSON.stringify(updated));
    setAssignedEngineers(updated);
    window.dispatchEvent(new Event("storage"));

    const newTasks = allTasks.map((t) =>
      t.id === taskId ? { ...t, status: "In Progress" } : t
    );
    setAllTasks(newTasks);

    message.success(`${engineer} assigned.`);
  };


  const handleRemove = (taskId, engineerName) => {
    const updated = { ...assignedEngineers };
    updated[taskId] = (updated[taskId] || []).filter((e) => e.name !== engineerName);
    if (updated[taskId].length === 0) delete updated[taskId];
    localStorage.setItem("assignedTasks", JSON.stringify(updated));
    setAssignedEngineers(updated);
    message.success(`Removed ${engineerName}`);
  };

  const handleGoToDetail = (taskId, taskType, taskOnlyId) => {
    const path =
      taskType === "Installation"
        ? `/taskjson/1`
        : `/commissionjson/1`;
    navigate(path);
  };


  if (loading) return <Spin tip="Loading..." style={{ marginTop: "20vh" }} />;

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}><TeamOutlined /> Supervisor Dashboard</Title>

      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Select value={selectedStatus} onChange={setSelectedStatus} style={{ width: "100%" }}>
            <Option value="All">All Statuses</Option>
            {Object.keys(statusColors).map((s) => <Option key={s} value={s}>{s}</Option>)}
          </Select>
        </Col>
        <Col span={8}>
          <Select value={selectedLocomotive} onChange={setSelectedLocomotive} style={{ width: "100%" }}>
            <Option value="All">All Locomotives</Option>
            {locomotives.map((loco) => (
              <Option key={loco.locomotiveId} value={loco.name}>{loco.name}</Option>
            ))}
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
      </Row>

      {/* Tasks */}
      <Card title="Tasks to Supervise">
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredTasks}
          renderItem={(task) => {
            const engineerList = Array.isArray(assignedEngineers[task.id])
              ? assignedEngineers[task.id]
              : [];

            return (
              <List.Item>
                <Card
                  title={
                    <Button
                      type="link"
                      onClick={() => {
                        const taskOnlyId = task.id.split("-")[2]; // extract task id like 'task-001'
                        handleGoToDetail(task.id, task.type, taskOnlyId);
                      }}
                      style={{ padding: 0 }}
                    >
                      <Text strong>{task.title}</Text>
                    </Button>

                  }
                  extra={<Tag color={statusColors[task.status]}>{task.status}</Tag>}
                  actions={[
                    <Button type="link" icon={<UserAddOutlined />} onClick={() => openAssignModal(task)}>
                      Assign / Reassign
                    </Button>
                  ]}
                >
                  {engineerList.map((eng, idx) => (
                    <Tag
                      key={idx}
                      color="green"
                      closable
                      onClose={() => handleRemove(task.id, eng.name)}
                    >
                      {eng.name} ({eng.discipline})
                    </Tag>
                  ))}
                </Card>
              </List.Item>
            );
          }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={`Assign Engineer for "${selectedTask?.title}"`}
        open={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAssign}>
          <Form.Item name="engineer" label="Engineer" rules={[{ required: true }]}>
            <Select placeholder="Select Engineer" showSearch optionFilterProp="children">
              {["Mechanical", "Electrical", "Software", "Quality"].map((disc) => (
                <OptGroup key={disc} label={disc}>
                  {engineers
                    .filter((e) => e.discipline === disc)
                    .map((e) => (
                      <Option key={e.id} value={e.name}>{e.name}</Option>
                    ))}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="discipline" label="Discipline" rules={[{ required: true }]}>
            <Select placeholder="Select Discipline">
              <Option value="Mechanical">Mechanical</Option>
              <Option value="Electrical">Electrical</Option>
              <Option value="Software">Software</Option>
              <Option value="Quality">Quality</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Assign Engineer</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupervisorDashboard;
