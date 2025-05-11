import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Card, Row, Col, Statistic, Tag } from "antd";
import {
  UserOutlined,
  ApartmentOutlined,
  ExclamationCircleOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import DashboardProgressCard from "../../components/DashboardProgressCard";
import { useLocomotives } from "../../hooks/useMockData";

const AdminDashboard = () => {
  const { locomotives, loading } = useLocomotives();
  const [pendingSignoffs, setPendingSignoffs] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Calculate pending sign-offs
  useEffect(() => {
    if (!loading) {
      let count = 0;
      locomotives.forEach((loco) => {
        loco.wmsList.forEach((wms) => {
          wms.tasks.forEach((task) => {
            if (task.status !== "Signed Off") {
              count++;
            }
          });
        });
      });
      setPendingSignoffs(count);
    }
  }, [locomotives, loading]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
      <div style={{ padding: 24 }}>
        <h1 style={{ marginBottom: 24 }}>Admin Dashboard</h1>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Locomotives"
                value={locomotives.length}
                prefix={<ApartmentOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Active Users"
                value={24} 
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Pending Sign-offs"
                value={pendingSignoffs}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Network">
              <Tag color={isOnline ? "green" : "red"}>
                <WifiOutlined /> {isOnline ? "Online" : "Offline"}
              </Tag>
            </Card>
            <DashboardProgressCard />
          </Col>
        </Row>
      </div>
  );
};

export default AdminDashboard;
