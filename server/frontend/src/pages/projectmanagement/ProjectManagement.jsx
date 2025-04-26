// src/pages/ProjectManagementPage.jsx
import { useState } from "react";
import { Table, Button, Typography, Modal, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import PageLayout from '../../components/PageLayout';
import mockLocomotives from "../../data/mockProjectData";

const { Title } = Typography;

const ProjectManagementPage = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [locomotives, setLocomotives] = useState(mockLocomotives);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCreateLocomotive = (values) => {
    setLocomotives([...locomotives, { id: `loco${locomotives.length + 1}`, ...values, wms: [] }]);
    message.success("Locomotive created successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    { title: "Locomotive Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Baseline", dataIndex: "baseline", key: "baseline" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/projects/${record.id}/wms`)}>View WMS</Button>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="p-6 bg-white min-h-screen">
        <Title level={3}>Project Management</Title>
        {role === "Admin" && (
          <Button type="primary" className="mb-4" onClick={() => setIsModalVisible(true)}>
            Create New Locomotive
          </Button>
        )}
        <Table rowKey="id" columns={columns} dataSource={locomotives} bordered />

        <Modal
          title="Create Locomotive"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateLocomotive}>
            <Form.Item name="name" label="Locomotive Name" rules={[{ required: true, message: "Please enter locomotive name" }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true, message: "Please enter locomotive type" }]}> 
              <Input />
            </Form.Item>
            <Form.Item name="baseline" label="Baseline" rules={[{ required: true, message: "Please enter baseline" }]}> 
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Create</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default ProjectManagementPage;
