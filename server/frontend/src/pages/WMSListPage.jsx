// src/pages/WMSListPage.jsx
import { useState } from "react";
import { Table, Button, Typography, Modal, Form, Input, Select, message  } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import PageLayout from "../components/PageLayout";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const WMSListPage = () => {
  const { locomotiveId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [wmsList, setWmsList] = useState([
    { id: "wms1", title: "WMS - Electrical", version: "1.2", status: "In Progress", type: "Installation" },
    { id: "wms2", title: "WMS - Hydraulic", version: "1.0", status: "Pending", type: "Commissioning" },
  ]);
  const [form] = Form.useForm();

  const role = localStorage.getItem("role");

  const handleUploadWMS = (values) => {
    setWmsList([...wmsList, { id: `wms${wmsList.length + 1}`, ...values }]);
    message.success("WMS uploaded successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  const fields = [
    { label: "Title", key: "title", type: "text" },
    { label: "Type", key: "type", type: "select", options: ["Installation", "Commissioning"] },
    { label: "Status", key: "status", type: "select", options: ["Pending", "In Progress", "Completed"] },
  ];

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

  const filtered = wmsList.filter((item) => {
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

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Version", dataIndex: "version", key: "version" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/tasks/${locomotiveId}/wms/${record.id}`)}>
          View Tasks
        </Button>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="p-6 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>WMS Documents for Locomotive {locomotiveId}</Title>
          {role === "Admin" && (
            <Button type="primary" onClick={() => setIsModalVisible(true)}>+ Upload WMS</Button>
          )}
        </div>

        <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />

        <Table rowKey="id" columns={columns} dataSource={filtered} bordered pagination={{ pageSize: 5 }} />

        <Modal
          title="Upload New WMS Document"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleUploadWMS}>
            <Form.Item name="title" label="WMS Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="version" label="Version" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select placeholder="Select type">
                <Option value="Installation">Installation</Option>
                <Option value="Commissioning">Commissioning</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Select status">
                <Option value="Pending">Pending</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Completed">Completed</Option>
              </Select>
            </Form.Item>
            <Form.Item name="file" label="Attach WMS File">
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Upload WMS</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default WMSListPage;
