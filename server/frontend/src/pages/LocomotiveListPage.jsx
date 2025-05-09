// src/pages/LocomotiveListPage.jsx
import { useState } from "react";
import { Card, Button, Typography, Row, Col, Modal, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import { useLocomotives } from "../hooks/useMockData"; // ✅ Hook

const { Title } = Typography;

const LocomotiveListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { locomotives, loading, createLocomotive } = useLocomotives();

  const role = localStorage.getItem("role");

  const fields = [
    { label: "Name", key: "name", type: "text" },
    { label: "Baseline", key: "baseline", type: "text" },
  ];

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

  const filtered = locomotives.filter((item) => {
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

  const handleCreateLocomotive = async (values) => {
    const newLoco = {
      locomotiveId: `Loco-${Math.floor(1000 + Math.random() * 9000)}`, // random 4 digit ID
      name: values.name,
      baseline: values.baseline,
      wmsList: [], // initially empty
    };
    await createLocomotive(newLoco);
    message.success("Locomotive created successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  if (loading) return <div>Loading Locomotives...</div>;

  return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <Title level={2}>Locomotive Overview</Title>
          {role === "Admin" && (
            <Button type="primary" onClick={() => setIsModalVisible(true)}>+ Create Locomotive</Button>
          )}
        </div>

        <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />

        <Row gutter={[16, 16]}>
          {filtered.map((loco) => (
            <Col xs={24} md={12} lg={8} key={loco.locomotiveId}>
              <Card
                title={loco.name}
                actions={[
                  <Button type="primary" onClick={() => navigate(`/tasks/${loco.locomotiveId}/wms`)}>View WMS</Button>
                ]}
                className="rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <p><strong>ID:</strong> {loco.locomotiveId}</p>
                <p><strong>Baseline:</strong> {loco.baseline}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <Modal
          title="Create Locomotive"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateLocomotive}>
            <Form.Item name="name" label="Locomotive Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="baseline" label="Baseline" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Create</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default LocomotiveListPage;
