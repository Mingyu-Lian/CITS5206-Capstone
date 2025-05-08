import DashboardLayout from "../../components/DashboardLayout";
import {
  Card, List, Tag, Typography, Select, Input, Row, Col, Spin,
  Button, Modal, Form, message
} from "antd";
import { useState, useEffect } from "react";
import { useLocomotives } from "../../hooks/useMockData";
import users from "../../mock/mockUsers";
import useAssignedEngineers from "../../hooks/useAssignedEngineers";

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
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedLocomotive, setSelectedLocomotive] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form] = Form.useForm();

  const engineers = users.filter((u) => u.role === "Engineer");

  const { assigned, addEngineer, removeEngineer } = useAssignedEngineers(selectedTask?.id);

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

  const handleAssign = async (values) => {
    await addEngineer({
      name: values.engineer,
      discipline: values.discipline,
    });
    message.success(`${values.engineer} assigned.`);
    form.resetFields();
  };

  if (loading) return <Spin tip="Loading..." style={{ marginTop: "20vh" }} />;

  return (
    <DashboardLayout>
      <div style={{ padding: 24 }}>
        <Title level={2}>Supervisor Dashboard</Title>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Select value={selectedStatus} onChange={setSelectedStatus} style={{ width: "100%" }}>
              <Option value="All">All Statuses</Option>
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Signed Off">Signed Off</Option>
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

        <Card title="Tasks to Supervise">
          <List
            dataSource={filteredTasks}
            renderItem={(task) => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => openAssignModal(task)}>Assign Engineer</Button>
                ]}
              >
                <List.Item.Meta
                  title={task.title}
                  description={<Tag color={statusColors[task.status]}>{task.status}</Tag>}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Modal for Assigning Engineers */}
        <Modal
          title={`Assign Engineer for "${selectedTask?.title}"`}
          open={assignModalVisible}
          onCancel={() => setAssignModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAssign}>
            <Form.Item name="engineer" label="Engineer" rules={[{ required: true }]}>
              <Select
                placeholder="Select Engineer"
                onChange={(val) => {
                  const eng = engineers.find((e) => e.name === val);
                  form.setFieldsValue({ discipline: eng?.discipline });
                }}
              >
                {engineers.map((eng) => (
                  <Option key={eng.id} value={eng.name}>{eng.name}</Option>
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
              <Button type="primary" htmlType="submit" block>Assign</Button>
            </Form.Item>
          </Form>

          {/* Assigned Engineer Tags */}
          <div style={{ marginTop: 16 }}>
            {assigned.map((eng, idx) => (
              <Tag
                key={idx}
                color="green"
                closable
                onClose={() => removeEngineer(eng.name)}
              >
                {eng.name} ({eng.discipline})
              </Tag>
            ))}
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;
