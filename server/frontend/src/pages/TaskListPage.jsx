import { useState, useEffect } from "react";
import {
  Table, Button, Tag, Typography, Checkbox, Tooltip, Space, message,
  Modal, Form, Select
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import PageLayout from "../components/PageLayout";
import { useTasks } from "../hooks/useMockData";
import users from "../mock/mockUsers";
import { fetchTaskSignOffs, toggleTaskSignOff, supervisorSignOffTask } from "../mock/mockApi";

const { Title } = Typography;
const { Option, OptGroup } = Select;

const TaskListPage = () => {
  const { locomotiveId, wmsId } = useParams();
  const navigate = useNavigate();
  const { tasks, loading } = useTasks(locomotiveId, wmsId);

  const [taskList, setTaskList] = useState([]);
  const [signOffs, setSignOffs] = useState({});
  const [filters, setFilters] = useState({});
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form] = Form.useForm();
  const [assignedTasksMap, setAssignedTasksMap] = useState(
    JSON.parse(localStorage.getItem("assignedTasks") || "{}")
  );

  const currentUser = localStorage.getItem("name");
  const currentRole = localStorage.getItem("role");
  const currentDiscipline = localStorage.getItem("discipline");

  useEffect(() => {
    if (!loading && tasks.length) {
      setTaskList(tasks);
    }
  }, [loading, tasks]);

  useEffect(() => {
    const loadSignOffs = async () => {
      const stored = await fetchTaskSignOffs();
      setSignOffs(stored);
    };

    loadSignOffs();

    const interval = setInterval(loadSignOffs, 3000); // Live sync
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "assignedTasks") {
        const parsed = JSON.parse(e.newValue || "{}");
        setAssignedTasksMap(parsed);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

  const filtered = taskList.filter((item) => {
    return (!filters.rules || filters.rules.every((r) => {
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

  const handleEngineerToggle = async (taskId, engineer) => {
    const updated = await toggleTaskSignOff(taskId, engineer);
    setSignOffs((prev) => ({ ...prev, [`${taskId}-${engineer}`]: updated }));
    message.success(`${engineer} ${updated ? "signed off" : "un-signed"} task`);
  };

  const handleSupervisorToggle = async (record) => {
    await supervisorSignOffTask(locomotiveId, wmsId, record.taskId);
    message.success(`Task "${record.title}" marked as Completed by Supervisor`);
    const updated = taskList.map(task =>
      task.taskId === record.taskId ? { ...task, status: "Completed" } : task
    );
    setTaskList(updated);
  };

  const handleAssignEngineer = ({ engineer, discipline }) => {
    const fullTaskId = `${locomotiveId}-${wmsId}-${selectedTask.taskId}`;
    const updated = JSON.parse(localStorage.getItem("assignedTasks") || "{}");

    if (!Array.isArray(updated[fullTaskId])) {
      updated[fullTaskId] = [];
    }

    const alreadyAssigned = updated[fullTaskId].some(e => e.name === engineer);
    if (alreadyAssigned) {
      message.warning(`${engineer} already assigned.`);
      return;
    }

    updated[fullTaskId].push({ name: engineer, discipline });
    localStorage.setItem("assignedTasks", JSON.stringify(updated));
    setAssignedTasksMap(updated);
    window.dispatchEvent(new Event("storage"));
    message.success(`${engineer} assigned.`);
    setAssignModalVisible(false);
  };

  const handleRemoveEngineer = (fullTaskId, engineerName) => {
    const updated = { ...assignedTasksMap };
    updated[fullTaskId] = (updated[fullTaskId] || []).filter((e) => e.name !== engineerName);
    if (updated[fullTaskId].length === 0) delete updated[fullTaskId];

    localStorage.setItem("assignedTasks", JSON.stringify(updated));
    setAssignedTasksMap(updated);
    window.dispatchEvent(new Event("storage"));
    message.success(`Removed ${engineerName}`);
  };

  const columns = [
    { title: "Task", dataIndex: "title", key: "title" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={
          status === "Completed" ? "green" :
            status === "In Progress" ? "orange" :
              status === "Pending" ? "red" : "blue"
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: "Engineer Sign-Offs",
      key: "engineers",
      render: (_, record) => {
        const fullTaskId = `${locomotiveId}-${wmsId}-${record.taskId}`;
        const assigned = Array.isArray(assignedTasksMap[fullTaskId]) ? assignedTasksMap[fullTaskId] : [];

        if (assigned.length === 0) {
          return <i style={{ color: "gray" }}>No engineer assigned</i>;
        }

        return (
          <Space direction="vertical">
            {assigned.map((eng, idx) => {
              const key = `${fullTaskId}-${eng.name}`;
              const canCheck =
                (currentUser === eng.name && eng.discipline?.toLowerCase() === currentDiscipline?.toLowerCase()) ||
                currentRole === "Admin";
              const supervisorCompleted = record.status === "Completed";

              return (
                <Space key={idx}>
                  <Checkbox
                    checked={signOffs[key]}
                    disabled={!canCheck || supervisorCompleted}
                    onChange={() => handleEngineerToggle(fullTaskId, eng.name)}
                  >
                    {eng.name}
                  </Checkbox>
                  {(currentRole === "Supervisor" || currentRole === "Admin") && (
                    <Button
                      type="link"
                      size="small"
                      danger
                      onClick={() => handleRemoveEngineer(fullTaskId, eng.name)}
                      style={{ padding: 0 }}
                    >
                      ✕
                    </Button>
                  )}
                </Space>
              );
            })}
          </Space>
        );
      }
    },
    {
      title: "Supervisor Sign-Off",
      key: "supervisor",
      render: (_, record) => {
        const signed = record.status === "Completed";
        const canCheck =
          currentRole === "Admin" ||
          (currentRole === "Supervisor" &&
            currentDiscipline?.toLowerCase() === record.discipline?.toLowerCase() &&
            !signed);

        return (
          <Tooltip title={canCheck ? "You can complete this task" : "Not permitted"}>
            <Checkbox
              checked={signed}
              disabled={!canCheck}
              onChange={() => handleSupervisorToggle(record)}
            >
              Mark Completed
            </Checkbox>
          </Tooltip>
        );
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/taskdetail/${locomotiveId}/${wmsId}/${record.taskId}`)}
          >
            View / Update Task
          </Button>
          {currentRole === "Supervisor" && (
            <Button
              type="link"
              onClick={() => {
                setSelectedTask(record);
                form.resetFields();
                setAssignModalVisible(true);
              }}
            >
              Assign Engineer
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (loading) return <div>Loading Tasks...</div>;

  return (
    <PageLayout>
      <div className="p-6 bg-white min-h-screen">
        <Title level={3}>Assigned Tasks for Locomotive {locomotiveId}, WMS {wmsId}</Title>

        <QueryBuilder
          fields={[
            { label: "Title", key: "title", type: "text" },
            { label: "Status", key: "status", type: "select", options: ["Pending", "In Progress", "Completed", "Signed Off"] },
          ]}
          onApply={applyFilters}
          onClear={clearFilters}
        />
        <Table rowKey="taskId" columns={columns} dataSource={filtered} bordered />

        {/* Assignment Modal */}
        <Modal
          title={`Assign Engineer for "${selectedTask?.title}"`}
          open={assignModalVisible}
          onCancel={() => setAssignModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAssignEngineer}>
            <Form.Item name="engineer" label="Engineer" rules={[{ required: true }]}>
              <Select placeholder="Select Engineer" showSearch optionFilterProp="children">
                {["Mechanical", "Electrical", "Software", "Quality"].map((disc) => (
                  <OptGroup key={disc} label={disc}>
                    {users
                      .filter((e) => e.role === "Engineer" && e.discipline === disc)
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
              <Button type="primary" htmlType="submit" block>
                Assign Engineer
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default TaskListPage;
