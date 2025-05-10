import { useState, useEffect } from "react";
import { Table, Button, Tag, Typography, Checkbox, Tooltip, Space, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import PageLayout from "../components/PageLayout";
import { useTasks } from "../hooks/useMockData";
import { fetchTaskSignOffs, toggleTaskSignOff, supervisorSignOffTask } from "../mock/mockApi";

const { Title } = Typography;

const TaskListPage = () => {
  const { locomotiveId, wmsId } = useParams();
  const navigate = useNavigate();
  const { tasks, loading } = useTasks(locomotiveId, wmsId);

  const [taskList, setTaskList] = useState([]);
  const [signOffs, setSignOffs] = useState({});
  const [filters, setFilters] = useState({});

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
        const assignedTasks = JSON.parse(localStorage.getItem("assignedTasks") || "{}");
        const assigned = Array.isArray(assignedTasks[fullTaskId]) ? assignedTasks[fullTaskId] : [];

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

              return (
                <Checkbox
                  key={idx}
                  checked={signOffs[key]}
                  disabled={!canCheck}
                  onChange={() => handleEngineerToggle(fullTaskId, eng.name)}
                >
                  {eng.name}
                </Checkbox>
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
        <Button
          type="link"
          onClick={() => navigate(`/taskdetail/${locomotiveId}/${wmsId}/${record.taskId}`)}
        >
          View / Update Task
        </Button>
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
      </div>
    </PageLayout>
  );
};

export default TaskListPage;
