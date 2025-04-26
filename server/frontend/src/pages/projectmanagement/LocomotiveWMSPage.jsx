// src/pages/LocomotiveWMSPage.jsx
import { useState } from "react";
import { Table, Button, Typography, Modal, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../components/PageLayout";
import mockLocomotives from "../../data/mockProjectData";

const { Title } = Typography;
const { Option } = Select;

const LocomotiveWMSPage = () => {
  const { locomotiveId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [wmsList, setWmsList] = useState(mockLocomotives);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleUploadWMS = (values) => {
    setWmsList([...wmsList, { id: `wms${wmsList.length + 1}`, ...values, tasks: [], file: values.file?.file?.name || "" }]);
    message.success("WMS uploaded successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: "WMS Title", dataIndex: "title", key: "title" },
    { title: "WMS Type", dataIndex: "type", key: "type" },
    { title: "File", dataIndex: "file", key: "file", render: (text) => text ? text : "No File Uploaded" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/projects/${locomotiveId}/wms/${record.id}/tasks`)}>View Tasks</Button>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="p-6 bg-white min-h-screen">
        <Title level={3}>WMS Documents for Locomotive: {locomotiveId}</Title>
        {role === "Admin" && (
          <Button type="primary" className="mb-4" onClick={() => setIsModalVisible(true)}>
            Upload New WMS
          </Button>
        )}
        <Table rowKey="id" columns={columns} dataSource={wmsList} bordered />

        <Modal
          title="Upload WMS Document"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleUploadWMS}>
            <Form.Item name="title" label="WMS Title" rules={[{ required: true, message: "Please enter WMS title" }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="type" label="WMS Type" rules={[{ required: true, message: "Please select WMS type" }]}> 
              <Select placeholder="Select type">
                <Option value="Installation">Installation</Option>
                <Option value="Commissioning">Commissioning</Option>
              </Select>
            </Form.Item>
            <Form.Item name="file" label="Upload WMS File">
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Upload</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default LocomotiveWMSPage;
