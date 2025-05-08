import { useState } from "react";
import {
  Card,
  Button,
  Typography,
  Row,
  Col,
  Modal,
  Form,
  Input,
  message,
  Select,
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import PageLayout from "../components/PageLayout";
import { useLocomotives, useBaselines } from "../hooks/useMockData";

const { Title } = Typography;
const { Option } = Select;

const LocomotiveListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentLoco, setCurrentLoco] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const {
    locomotives,
    loading,
    createLocomotive,
    editLocomotive,
    deleteLocomotive,
  } = useLocomotives();
  const { baselines, loading: loadingBaselines } = useBaselines();

  const role = localStorage.getItem("role");

  const fields = [
    { label: "Name", key: "name", type: "text" },
    { label: "Baseline", key: "baseline", type: "text" },
  ];

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

  const filtered = locomotives.filter((item) => {
    return (
      !filters.rules ||
      filters.rules.every((r) => {
        const val = item[r.field]?.toString().toLowerCase();
        const q = r.value.toString().toLowerCase();
        switch (r.operator) {
          case "Equal":
            return val === q;
          case "Contains":
            return val.includes(q);
          case "Starts With":
            return val.startsWith(q);
          default:
            return true;
        }
      })
    );
  });

  const handleCreate = async (values) => {
    const newLoco = {
      locomotiveId: `Loco-${Math.floor(1000 + Math.random() * 9000)}`,
      name: values.name,
      baseline: values.baseline,
      wmsList: [],
    };
    await createLocomotive(newLoco);
    message.success("Locomotive created.");
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleEditClick = (loco) => {
    setCurrentLoco(loco);
    form.setFieldsValue({ name: loco.name, baseline: loco.baseline });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    await editLocomotive(currentLoco.locomotiveId, values);
    message.success("Locomotive updated.");
    setIsEditModalVisible(false);
    form.resetFields();
    setCurrentLoco(null);
  };

  const handleDelete = async (locomotiveId) => {
    setDeletingId(locomotiveId);
    try {
      await deleteLocomotive(locomotiveId);
      message.success("Locomotive deleted.");
    } catch (error) {
      message.error("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div>Loading Locomotives...</div>;

  return (
    <PageLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <Title level={2}>Locomotive Overview</Title>
          {role === "Admin" && (
            <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
              + Create Locomotive
            </Button>
          )}
        </div>

        <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />

        <Row gutter={[16, 16]}>
          {filtered.map((loco) => (
            <Col xs={24} md={12} lg={8} key={loco.locomotiveId}>
              <Card
                title={loco.name}
                actions={[
                  <Button onClick={() => navigate(`/tasks/${loco.locomotiveId}/wms`)}>
                    View WMS
                  </Button>,
                  <Button type="link" onClick={() => handleEditClick(loco)}>
                    Edit
                  </Button>,
                  <Popconfirm
                  title="Delete this locomotive?"
                  onConfirm={() => handleDelete(loco.locomotiveId)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ loading: deletingId === loco.locomotiveId }}
                >
                  <Button type="link" danger disabled={deletingId === loco.locomotiveId}>
                    {deletingId === loco.locomotiveId ? "Deleting..." : "Delete"}
                  </Button>
                </Popconfirm>
                
                ]}
                className="rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <p><strong>ID:</strong> {loco.locomotiveId}</p>
                <p><strong>Baseline:</strong> {loco.baseline}</p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Create Locomotive Modal */}
        <Modal
          title="Create Locomotive"
          open={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreate}>
            <Form.Item name="name" label="Locomotive Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="baseline" label="Select Baseline" rules={[{ required: true }]}>
              <Select
                placeholder="Select baseline"
                loading={loadingBaselines}
                disabled={loadingBaselines || baselines.length === 0}
              >
                {baselines.map((b) => (
                  <Option key={b.id} value={b.version}>
                    {b.version}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Create
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Edit Locomotive Modal */}
        <Modal
          title="Edit Locomotive"
          open={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setCurrentLoco(null);
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
            <Form.Item name="name" label="Locomotive Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="baseline" label="Select Baseline" rules={[{ required: true }]}>
              <Select
                placeholder="Select baseline"
                loading={loadingBaselines}
                disabled={loadingBaselines || baselines.length === 0}
              >
                {baselines.map((b) => (
                  <Option key={b.id} value={b.version}>
                    {b.version}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Update
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PageLayout>
  );
};

export default LocomotiveListPage;
