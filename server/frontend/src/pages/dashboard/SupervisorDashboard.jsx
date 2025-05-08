import DashboardLayout from "../../components/DashboardLayout";
import {
  Card,
  List,
  Tag,
  Typography,
  Select,
  Input,
  Row,
  Col,
  Spin,
  Button,
  Modal,
  Form,
} from "antd";
import { useState, useEffect } from "react";
import { useLocomotives } from "../../hooks/useMockData";
import users from "../../mock/mockUsers";

const engineers = users.filter((user) => user.role === "Engineer");

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
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [form] = Form.useForm();

  // Load valid assignments from localStorage
  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("assignedTasks") || "{}");
    const cleaned = Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v.name && v.discipline
      )
    );
    setAssignedTasks(cleaned);
  }, []);

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
      setAllTasks(tasks);
    }
  }, [loading, locomotives]);

  if (loading) {
    return (
      <Spin
        tip="Loading Supervision Tasks..."
        size="large"
        style={{ marginTop: "20vh" }}
      />
    );
  }

  const filteredTasks = allTasks.filter((task) => {
    const statusMatch =
      selectedStatus === "All" || task.status === selectedStatus;
    const locoMatch =
      selectedLocomotive === "All" || task.locomotive === selectedLocomotive;
    const searchMatch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return statusMatch && locoMatch && searchMatch;
  });

  const openAssignModal = (task) => {
    setSelectedTask(task);
    setSelectedEngineer(null);
    form.resetFields();
    setAssignModalVisible(true);
  };

  const handleAssign = (values) => {
    const updatedAssignments = JSON.parse(
      localStorage.getItem("assignedTasks") || "{}"
    );
    updatedAssignments[selectedTask.id] = {
      name: values.engineer,
      discipline: values.discipline,
    };
    localStorage.setItem("assignedTasks", JSON.stringify(updatedAssignments));
    setAssignedTasks(updatedAssignments);

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
    <DashboardLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>Supervisor Dashboard</Title>

        {/* Filters */}
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

        <Row style={{ marginBottom: 24 }}>
          <Button
            type="default"
            onClick={() => {
              setSelectedStatus("All");
              setSelectedLocomotive("All");
              setSearchTerm("");
            }}
          >
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
                        <Button
                          type="link"
                          onClick={() => openAssignModal(task)}
                        >
                          Assign Engineer
                        </Button>,
                      ]
                    : []
                }
              >
                <List.Item.Meta
                  title={
                    <>
                      {task.title}
                      {assignedTasks[task.id] &&
                        assignedTasks[task.id].name &&
                        assignedTasks[task.id].discipline && (
                          <Tag color="green" style={{ marginLeft: 8 }}>
                            Assigned to {assignedTasks[task.id].name} (
                            {assignedTasks[task.id].discipline})
                          </Tag>
                        )}
                    </>
                  }
                  description={
                    <Tag color={statusColors[task.status] || "default"}>
                      {task.status}
                    </Tag>
                  }
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
              <Select
                placeholder="Select Engineer"
                onChange={(value) => {
                  const eng = engineers.find((e) => e.name === value);
                  setSelectedEngineer(eng);
                  form.setFieldsValue({ discipline: eng?.discipline });
                }}
              >
                {engineers.map((engineer) => (
                  <Option key={engineer.id} value={engineer.name}>
                    {engineer.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="discipline"
              label="Engineer Discipline"
              rules={[
                {
                  required: true,
                  message: "Please confirm engineer's discipline",
                },
              ]}
            >
              <Select placeholder="Select Discipline">
                <Option value="Electrical">Electrical</Option>
                <Option value="Mechanical">Mechanical</Option>
                <Option value="Software">Software</Option>
                <Option value="Mechanical Electrical">
                  Mechanical Electrical
                </Option>
                <Option value="Quality">Quality</Option>
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
    </DashboardLayout>
  );
};

export default SupervisorDashboard;
