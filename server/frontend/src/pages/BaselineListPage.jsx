// src/pages/BaselineListPage.jsx

import { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Popconfirm
} from "antd";
import PageLayout from "../components/PageLayout";
import { useBaselines } from "../hooks/useMockData"; //  Hook for baseline CRUD

const { Title } = Typography;



const BaselineListPage = () => {
  const { baselines, loading, createBaseline, removeBaseline } = useBaselines();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [deletingId, setDeletingId] = useState(null);

  const handleCreateBaseline = async (values) => {
    const version = values.version.trim();
    const duplicate = baselines.find(b => b.version === version);
    if (duplicate) {
      message.error("Baseline version already exists.");
      return;
    }

    const newBaseline = {
      id: `baseline-${Math.floor(1000 + Math.random() * 9000)}`,
      version,
      description: values.description || "No description",
    };
    await createBaseline(newBaseline);
    message.success("Baseline created successfully.");
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = async (baselineId) => {
    setDeletingId(baselineId);
    try {
      await removeBaseline(baselineId);
      message.success("Baseline deleted.");
    } catch (err) {
      message.error("Failed to delete baseline.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading baselines...</div>;

  return (
    <PageLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <Title level={2}>Baseline Management</Title>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            + Create Baseline
          </Button>
        </div>

        <Row gutter={[16, 16]}>
          {baselines.map((baseline) => (
            <Col xs={24} sm={12} md={8} key={baseline.id}>
              <Card
                title={`Baseline ${baseline.version}`}
                extra={
                  <Popconfirm
                    title="Are you sure to delete this baseline?"
                    onConfirm={() => handleDelete(baseline.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>Delete</Button>
                  </Popconfirm>
                }
              >
                <p><strong>ID:</strong> {baseline.id}</p>
                <p><strong>Description:</strong> {baseline.description}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          title="Create New Baseline"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form layout="vertical" form={form} onFinish={handleCreateBaseline}>
            <Form.Item
              name="version"
              label="Baseline Version"
              rules={[{ required: true, message: "Please input version (e.g., v3.1)" }]}
            >
              <Input placeholder="e.g., v3.1" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} placeholder="Optional description" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Create
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default BaselineListPage;
