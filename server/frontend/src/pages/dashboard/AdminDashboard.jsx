import { Card, Row, Col, Statistic, Tag } from "antd";
import { UserOutlined, ApartmentOutlined, ExclamationCircleOutlined, WifiOutlined } from "@ant-design/icons";


const AdminDashboard = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}> Admin Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Locomotives" value={12} prefix={<ApartmentOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Active Users" value={24} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Pending Sign-offs" value={8} prefix={<ExclamationCircleOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
