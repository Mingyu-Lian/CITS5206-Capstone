import React, { useState } from "react";
import { Upload, Button, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createLogEntry, saveAndMaybeSyncLog } from "../utils/offlineSyncHelper";

const SubtaskUploadCard = ({ subtask, taskId, wmsId, locomotiveId }) => {
  const [fileList, setFileList] = useState([]);

  const handleUploadChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);

    if (file.status === "done" || file.status === "uploading") {
      const log = createLogEntry("upload_file", {
        subtaskId: subtask.id,
        taskId,
        wmsId,
        locoID: locomotiveId,
        fileName: file.name,
      });
      saveAndMaybeSyncLog(log);
    }
  };

  return (
    <Card title={`Upload for Subtask ID: ${subtask.id}`} style={{ width: "100%" }}>
      <Upload
        customRequest={({ file, onSuccess }) => {
          setTimeout(() => {
            onSuccess("ok"); // simulate upload success immediately
          }, 100);
        }}
        onChange={handleUploadChange}
        fileList={fileList}
      >
        <Button icon={<UploadOutlined />}>Upload File</Button>
      </Upload>
    </Card>
  );
};

export default SubtaskUploadCard;
