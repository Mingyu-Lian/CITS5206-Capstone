// src/pages/SubtaskDetailPage.jsx
import { useState, useEffect } from "react";
import {
  Card,
  Checkbox,
  Input,
  Upload,
  Button,
  Typography,
  Divider,
  Tooltip,
  Form,
  Row,
  Col,
  Progress,
  message,
  Space
} from "antd";
import { UploadOutlined, FileSearchOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import { createLogEntry, saveAndMaybeSyncLog } from "../utils/offlineSyncHelper";
import localforage from "localforage";

const { Title, Text } = Typography;

const SubtaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({});
  const [completed, setCompleted] = useState({});
  const [data, setData] = useState([]);

  const fields = [
    { label: "Subtask ID", key: "id", type: "text" },
    { label: "Instruction", key: "instruction", type: "text" },
    { label: "Signed Off", key: "signedOff", type: "select", options: ["true", "false"] },
  ];

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

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

  useEffect(() => {
    loadSubtasksData();
  }, [taskId]);

  const loadSubtasksData = async () => {
    const offlineKey = `offlineSubtaskList-${taskId}`;

    if (navigator.onLine) {
      const onlineData = [
        { id: "sub1", instruction: "Verify voltage levels.", result: "", signedOff: false },
        { id: "sub2", instruction: "Capture photo of connected cable.", result: "", signedOff: false },
      ];

      setData(onlineData);
      await localforage.setItem(offlineKey, onlineData);
    } else {
      const cachedData = await localforage.getItem(offlineKey);
      if (cachedData) {
        setData(cachedData);
      }
    }
  };

  const updateOfflineSubtask = async (subId, field, value) => {
    const offlineKey = `offlineSubtaskList-${taskId}`;
    const cached = await localforage.getItem(offlineKey);
    if (cached) {
      const updated = cached.map(sub =>
        sub.id === subId ? { ...sub, [field]: value } : sub
      );
      await localforage.setItem(offlineKey, updated);
    }
  };

  const handleSave = async (subId) => {
    setCompleted((prev) => ({ ...prev, [subId]: true }));

    const currentData = formData[subId] || {};

    const saveLog = createLogEntry("click_save_subtask", {
      subtaskId: subId,
      taskId,
    });
    await saveAndMaybeSyncLog(saveLog);

    if (currentData.result?.trim()) {
      const noteLog = createLogEntry("write_note", {
        subtaskId: subId,
        taskId,
        content: currentData.result,
      });
      await saveAndMaybeSyncLog(noteLog);

      // ✅ Update cached result when clicking Save
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
      checked,
    });
    await saveAndMaybeSyncLog(log);

    await updateOfflineSubtask(subId, "signedOff", checked);
  };

  const handleViewRedirect = (subId) => {
    navigate(`/task-tabs/instruction-tab?subtaskId=${subId}`);
  };

  const total = filtered.length;
  const done = Object.keys(completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

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
                  <Form.Item label="Result / Notes">
                    <Input.TextArea
                      rows={3}
                      placeholder="Enter result or notes"
                      value={currentData.result || ""}
                      onChange={(e) => handleInputChange(sub.id, "result", e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="Attachment">
                    <Upload>
                      <Button icon={<UploadOutlined />}>Upload Image/Video</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item>
                    <Checkbox
                      checked={currentData.signedOff || false}
                      onChange={(e) => handleSignOffChange(sub.id, e.target.checked)}
                    >
                      Mark as Signed Off
                    </Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={() => handleSave(sub.id)}>
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
