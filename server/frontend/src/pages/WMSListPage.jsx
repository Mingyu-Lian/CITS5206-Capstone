// src/pages/WMSListPage.jsx
import { useState } from "react";
import { Table, Button, Typography, Modal, Form, Input, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import PageLayout from "../components/PageLayout";
import { useWMS } from "../hooks/useMockData"; // ✅ Hook for live WMS
import { UploadOutlined } from "@ant-design/icons"; // ✅ for UploadOutlined icon
import { Upload } from "antd"; // ✅ for Upload component


const { Title } = Typography;
const { Option } = Select;

const WMSListPage = () => {
  const { locomotiveId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { wmsList, loading, createWMS } = useWMS(locomotiveId);

  const role = localStorage.getItem("role"); // ✅ Important: fetch role from localStorage

  const fields = [
    { label: "Title", key: "title", type: "text" },
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

  const handleCreateWMS = async (values) => {
    const newWMS = {
      wmsId: `WMS-${Math.floor(1000 + Math.random() * 9000)}`, // generate random ID
      title: values.title,
      type: values.type,
      tasks: [], // new WMS starts empty
    };
    await createWMS(newWMS);
    message.success("WMS Document uploaded successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  if (loading) return <div>Loading WMS Documents...</div>;

  return (
    <PageLayout>
      <div className="p-6 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>WMS Documents for Locomotive {locomotiveId}</Title>

          {role === "Admin" && ( // ✅ Only Admin can see Upload WMS
            <Button type="primary" onClick={() => setIsModalVisible(true)}>+ Upload WMS</Button>
          )}
        </div>

        <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />

        <Table
          rowKey="wmsId"
          columns={[
            { title: "Title", dataIndex: "title", key: "title" },
            { title: "Type", dataIndex: "type", key: "type" },
            {
              title: "Action",
              key: "action",
              render: (_, record) => (
                <Button type="link" onClick={() => navigate(`/tasks/${locomotiveId}/wms/${record.wmsId}`)}>
                  View Tasks
                </Button>
              ),
            },
          ]}
          dataSource={filtered}
          bordered
          pagination={{ pageSize: 5 }}
        />

        {/* Upload WMS Modal */}
        <Modal
  title="Upload New WMS Document"
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={null}
>
  <Form form={form} layout="vertical" onFinish={(values) => {
    const newWMS = {
      wmsId: `WMS-${Math.floor(1000 + Math.random() * 9000)}`,
      title: values.title,
      type: values.type,
      file: values.file?.file?.name || null, // ✅ saving uploaded file name
      tasks: [],
    };
    createWMS(newWMS);
    message.success("WMS Document uploaded successfully!");
    setIsModalVisible(false);
    form.resetFields();
  }}>
    <Form.Item
      name="title"
      label="WMS Title"
      rules={[{ required: true, message: "Please enter WMS Title" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      name="type"
      label="Type"
      rules={[{ required: true, message: "Please select WMS Type" }]}
    >
      <Select placeholder="Select Type">
        <Option value="Installation">Installation</Option>
        <Option value="Commissioning">Commissioning</Option>
      </Select>
    </Form.Item>

    <Form.Item
      name="file"
      label="Attach WMS File"
      valuePropName="file"
    >
      <Upload beforeUpload={() => false}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit" block>
        Upload WMS
      </Button>
    </Form.Item>
  </Form>
</Modal>

      </div>
    </PageLayout>
  );
};

export default WMSListPage;
