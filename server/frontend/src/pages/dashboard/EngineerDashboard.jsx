// src/pages/EngineerDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, List, Typography, Button, message } from "antd";
import { SyncOutlined, ToolOutlined } from "@ant-design/icons";
import localforage from "localforage";
import { syncLogs } from "../../utils/offlineSyncHelper";

const { Title } = Typography;
const LOG_KEY = "offlineLogs";

const EngineerDashboard = () => {
  const [pendingSubtasks, setPendingSubtasks] = useState([]);

  useEffect(() => {
    fetchPendingSubtasks();

    const handleOnline = () => {
      if (pendingSubtasks.length > 0) {
        message.info("You have unsynced subtasks. Please click Sync to upload.");
      }
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [pendingSubtasks]);

  const fetchPendingSubtasks = async () => {
    const allLogs = (await localforage.getItem(LOG_KEY)) || [];
    const pendingLogs = allLogs.filter((log) => log.status === "pending");

    const uniqueSubtaskIds = [...new Set(
      pendingLogs
        .map((log) => {
          try {
            const detail = JSON.parse(log.details);
            return detail.subtaskId;
          } catch {
            return null;
          }
        })
        .filter((id) => id)
    )];

    setPendingSubtasks(uniqueSubtaskIds);
  };

  const handleSync = async () => {
    await syncLogs();
    message.success("Logs synced successfully.");
    fetchPendingSubtasks();
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Engineer Dashboard</Title>

      <Card
        title={<><ToolOutlined /> Pending Subtasks</>}
        extra={<Button type="primary" icon={<SyncOutlined />} onClick={handleSync}>Sync</Button>}
        style={{ marginBottom: 24 }}
      >
        {pendingSubtasks.length === 0 ? (
          <p>No pending subtasks. All changes are synced.</p>
        ) : (
          <List
            dataSource={pendingSubtasks}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta title={`Subtask ID: ${item}`} />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default EngineerDashboard;