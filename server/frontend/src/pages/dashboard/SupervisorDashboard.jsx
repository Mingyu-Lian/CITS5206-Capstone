// src/pages/dashboard/SupervisorDashboard.jsx
import { Card, List, Tag, Typography, Select, Input, Row, Col, Spin, Button, Modal, Form } from "antd";
import { useState, useEffect } from "react";
import { useLocomotives } from "../../hooks/useMockData";
import users from "../../mock/mockUsers"; // ✅ import real user data

const engineers = users.filter(user => user.role === "Engineer"); // ✅ filter real engineers

const { Title } = Typography;
const { Option } = Select;

const statusColors = {
  Pending: "orange",
  "In Progress": "blue",
  Completed: "green",
  "Signed Off": "green",
};

const SupervisorDashboard = () => {
  const { locomotives, loading } = useLocomotives();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLocomotive, setSelectedLocomotive] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!loading) {
      const tasks = [];
      locomotives.forEach((loco) => {
        loco.wmsList.forEach((wms) => {
          wms.tasks.forEach((task) => {
            tasks.push({
              id: `${loco.locomotiveId}-${wms.wmsId}-${task.taskId}`,
              title: `${task.title} (${loco.name})`,
              status: task.status,
              locomotive: loco.name,
            });
          });
        });
      });
      setAllTasks(tasks); // ✅ Save to React state
    }
  }, [loading, locomotives]);

  if (loading) return <Spin tip="Loading Supervision Tasks..." size="large" style={{ marginTop: "20vh" }} />;

  // Apply Filters
  const filteredTasks = allTasks.filter((task) => {
    const statusMatch = selectedStatus === "All" || task.status === selectedStatus;
    const locoMatch = selectedLocomotive === "All" || task.locomotive === selectedLocomotive;
    const searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && locoMatch && searchMatch;
  });

  // Open Modal
  const openAssignModal = (task) => {
    setSelectedTask(task);
    setAssignModalVisible(true);
  };

  // Handle Assign Engineer
  const handleAssign = (values) => {
    const updatedAssignments = JSON.parse(localStorage.getItem("assignedTasks") || "{}");
    updatedAssignments[selectedTask.id] = values.engineer;
    localStorage.setItem("assignedTasks", JSON.stringify(updatedAssignments));
  
    // Set task status to In Progress
    const updatedTasks = allTasks.map((task) => {
      if (task.id === selectedTask.id) {
        return { ...task, status: "In Progress" };
      }
      return task;
    });
    setAllTasks(updatedTasks);
  
    setAssignModalVisible(false);
    form.resetFields();
  };
  

  return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Supervisor Dashboard</Title>

        {/* Filter Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={8}>
            <Select
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              style={{ width: "100%" }}
              placeholder="Filter by Status"
            >
              <Option value="All">All Statuses</Option>
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Signed Off">Signed Off</Option>
            </Select>
          </Col>

          <Col xs={24} md={8}>
            <Select
              value={selectedLocomotive}
              onChange={(val) => setSelectedLocomotive(val)}
              style={{ width: "100%" }}
              placeholder="Filter by Locomotive"
            >
              <Option value="All">All Locomotives</Option>
              {locomotives.map((loco) => (
                <Option key={loco.locomotiveId} value={loco.name}>
                  {loco.name}
                </Option>
              ))}
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
        </Row>

        {/* Reset Filters */}
        <Row style={{ marginBottom: 24 }}>
          <Button type="default" onClick={() => {
            setSelectedStatus("All");
            setSelectedLocomotive("All");
            setSearchTerm("");
          }}>
            Reset Filters
          </Button>
        </Row>

        {/* Task List */}
        <Card title="Tasks to Supervise">
          <List
            dataSource={filteredTasks}
            renderItem={(task) => (
              <List.Item
                actions={
                  task.status === "Pending"
                    ? [
                        <Button type="link" onClick={() => openAssignModal(task)}>
                          Assign Engineer
                        </Button>
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  title={
                    <>
                      {task.title}
                      {assignedTasks[task.id] && (
                        <Tag color="green" style={{ marginLeft: 8 }}>
                          Assigned to {assignedTasks[task.id]}
                        </Tag>
                      )}
                    </>
                  }
                  description={<Tag color={statusColors[task.status] || "default"}>{task.status}</Tag>}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Assign Engineer Modal */}
        <Modal
  title={`Assign Engineer for "${selectedTask?.title}"`}
  open={assignModalVisible}
  onCancel={() => setAssignModalVisible(false)}
  footer={null}
>
  <Form form={form} layout="vertical" onFinish={handleAssign}>
    <Form.Item
      name="engineer"
      label="Select Engineer"
      rules={[{ required: true, message: "Please select an engineer" }]}
    >
      <Select placeholder="Select Engineer">
        {engineers.map((engineer) => (
          <Option key={engineer.id} value={engineer.name}>
            {engineer.name}
          </Option>
        ))}
      </Select>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" block>
        Assign
      </Button>
    </Form.Item>
  </Form>
</Modal>


      </div>
  );
};

export default SupervisorDashboard;
