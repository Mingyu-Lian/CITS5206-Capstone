// src/pages/LocomotiveListPage.jsx
import { useState } from "react";
import { Card, Button, Typography, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import PageLayout from "../components/PageLayout";


const { Title } = Typography;

const LocomotiveListPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});

  const data = [
    { id: "loco1", name: "Locomotive A", type: "Type X", baseline: "v3.0" },
    { id: "loco2", name: "Locomotive B", type: "Type Y", baseline: "v2.1" },
  ];

  const fields = [
    { label: "Name", key: "name", type: "text" },
    { label: "Type", key: "type", type: "select", options: ["Type X", "Type Y"] },
    { label: "Baseline", key: "baseline", type: "text" },
  ];

  const applyFilters = (query) => setFilters(query);
  const clearFilters = () => setFilters({});

  const filtered = data.filter((item) => {
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

  return (
    <PageLayout>
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2}>Locomotive Overview</Title>
      <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />
      <Row gutter={[16, 16]}>
        {filtered.map((loco) => (
          <Col xs={24} md={12} lg={8} key={loco.id}>
            <Card
              title={loco.name}
              actions={[<Button type="primary" onClick={() => navigate(`/tasks/${loco.id}/wms`)}>View WMS</Button>]}
              className="rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <p><strong>Type:</strong> {loco.type}</p>
              <p><strong>Baseline:</strong> {loco.baseline}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </PageLayout>
  );
};

export default LocomotiveListPage;