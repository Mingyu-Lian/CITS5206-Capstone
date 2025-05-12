// src/pages/SubtaskDetailPage.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Checkbox,
  Input,
  Upload,
  Button,
  Typography,
  Tooltip,
  Form,
  Row,
  Col,
  Progress,
  message,
  Space,
  Select
} from "antd";
import {
  UploadOutlined,
  FileSearchOutlined,
  CheckCircleTwoTone
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import { createLogEntry, saveAndMaybeSyncLog } from "../utils/offlineSyncHelper";
import localforage from "localforage";
import { getCachedLocomotiveData, cacheLocomotiveData } from "../utils/offlineSyncHelper";


const { Title, Text } = Typography;
const { Option } = Select;

const SubtaskDetailPage = () => {
  const { taskId, locomotiveId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({});
  const [completed, setCompleted] = useState({});
  const [assignedEngineers, setAssignedEngineers] = useState({});
  const [data, setData] = useState([]);

  const role = localStorage.getItem("role");
  const userDiscipline = localStorage.getItem("discipline");
  const userId = localStorage.getItem("userId") || "unknown";

  const engineers = ["Engineer A", "Engineer B", "Engineer C"];

  const fields = [
    { label: "Subtask ID", key: "id", type: "text" },
    { label: "Instruction", key: "instruction", type: "text" },
    { label: "Signed Off", key: "signedOff", type: "select", options: ["true", "false"] },
  ];

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

  const loadSubtasksData = async () => {
    const locoData = await getCachedLocomotiveData(locomotiveId);
  
    if (locoData) {
      const task = locoData.wmsList
        .flatMap(wms => wms.tasks)
        .find(task => task.taskId === taskId || task.id === taskId);
  
      if (task && task.subtasks) {
        setData(task.subtasks);
  
        const restoredForm = {};
        task.subtasks.forEach(sub => {
          restoredForm[sub.id] = {
            result: sub.result || "",
            signedOff: sub.signedOff || false
          };
        });
        setFormData(restoredForm);
  
        message.info("Loaded subtasks from cached data.");
      } else {
        setData([]);
        message.warning("No subtasks found for this task.");
      }
    } else {
      setData([]);
      message.warning("No cached data for this locomotive.");
    }
  };  
  
  useEffect(() => {
    loadSubtasksData();
  }, [taskId, userId, locomotiveId]);  


  const updateOfflineSubtask = async (subId, field, value) => {
    const locoData = await getCachedLocomotiveData(locomotiveId);
    if (!locoData) return;
  
    const newLocoData = { ...locoData };
  
    for (const wms of newLocoData.wmsList) {
      for (const task of wms.tasks) {
        if (task.taskId === taskId || task.id === taskId) {
          task.subtasks = task.subtasks.map(sub =>
            sub.id === subId ? { ...sub, [field]: value } : sub
          );
          break;
        }
      }
    }
  
    await cacheLocomotiveData(locomotiveId, newLocoData);
  };  

  const handleSave = async (subId) => {
    setCompleted((prev) => ({ ...prev, [subId]: true }));
    const currentData = formData[subId] || {};

    const saveLog = createLogEntry("click_save_subtask", {
      subtaskId: subId,
      taskId,
      locoID: locomotiveId,
    });
    await saveAndMaybeSyncLog(saveLog);

    if (currentData.result?.trim()) {
      const noteLog = createLogEntry("write_note", {
        subtaskId: subId,
        taskId,
        locoID: locomotiveId,
        content: currentData.result,
      });
      await saveAndMaybeSyncLog(noteLog);
      await updateOfflineSubtask(subId, "result", currentData.result);
    }

    if (!navigator.onLine) {
      message.info("You are offline. Your changes have been saved locally.");
    } else {
      message.success(`Subtask ${subId} saved.`);
    }
  };

  const handleInputChange = (subId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [subId]: {
        ...prev[subId],
        [field]: value
      }
    }));
  };

  const handleSignOffChange = async (subId, checked) => {
    handleInputChange(subId, "signedOff", checked);
    const log = createLogEntry("toggle_signoff", {
      subtaskId: subId,
      taskId,
      locoID: locomotiveId,
      checked,
    });
    await saveAndMaybeSyncLog(log);
    await updateOfflineSubtask(subId, "signedOff", checked);
  };

  const handleViewRedirect = (subId) => {
    navigate(`/task-tabs/instruction-tab?subtaskId=${subId}`);
  };

  const handleAssignEngineer = (subId, engineer) => {
    setAssignedEngineers(prev => ({ ...prev, [subId]: engineer }));
    message.success(`Engineer assigned to subtask ${subId}`);
  };

  const filtered = data.filter((item) => {
    return (!filters.rules || filters.rules.every(r => {
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

  const total = filtered.length;
  const done = Object.keys(completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const isSignOffDisabled = (subDiscipline) => {
    if (role === "Admin") return false;
    if (!subDiscipline) return true;
    if (subDiscipline === userDiscipline) return false;
    if (subDiscipline.includes("Mechanical Electrical") && (userDiscipline === "Mechanical" || userDiscipline === "Electrical")) return false;
    return true;
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Title level={2}>Subtasks for Task: {taskId}</Title>
        <Progress type="circle" percent={percent} width={60} strokeColor="#52c41a" />
      </div>

      <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />

      <Row gutter={[24, 24]}>
        {filtered.map((sub) => {
          const currentData = formData[sub.id] || {};
          const disabled = isSignOffDisabled(sub.discipline);
          return (
            <Col xs={24} sm={24} md={12} key={sub.id}>
              <Card
                title={<Text strong>{`Subtask ID: ${sub.id}`}</Text>}
                extra={
                  <Space>
                    {completed[sub.id] && <CheckCircleTwoTone twoToneColor="#52c41a" />}
                    <Tooltip title="Go to Task Details">
                      <Button icon={<FileSearchOutlined />} onClick={() => handleViewRedirect(sub.id)} />
                    </Tooltip>
                  </Space>
                }
                className="shadow-md rounded-xl border border-gray-200 hover:shadow-lg transition-all"
              >
                <Form layout="vertical">
                  <Form.Item label={<Text strong>Instruction</Text>}>
                    <Text>{sub.instruction}</Text>
                  </Form.Item>

                  {role === "Supervisor" && (
                    <Form.Item label="Assign Engineer">
                      <Select
                        placeholder="Assign Engineer"
                        value={assignedEngineers[sub.id]}
                        onChange={(value) => handleAssignEngineer(sub.id, value)}
                      >
                        {engineers.map((eng) => (
                          <Option key={eng} value={eng}>{eng}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}

                  <Form.Item label="Result / Notes">
                    <Input.TextArea
                      rows={3}
                      placeholder="Enter result or notes"
                      value={currentData.result || ""}
                      onChange={(e) => handleInputChange(sub.id, "result", e.target.value)}
                      disabled={disabled}
                    />
                  </Form.Item>

                  <Form.Item label="Attachment">
                    <Upload disabled={disabled}>
                      <Button icon={<UploadOutlined />} disabled={disabled}>Upload Image/Video</Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Checkbox
                      checked={currentData.signedOff || false}
                      onChange={(e) => handleSignOffChange(sub.id, e.target.checked)}
                      disabled={disabled}
                    >
                      Mark as Signed Off
                    </Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" onClick={() => handleSave(sub.id)} disabled={disabled}>
                      Save Subtask
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default SubtaskDetailPage;
