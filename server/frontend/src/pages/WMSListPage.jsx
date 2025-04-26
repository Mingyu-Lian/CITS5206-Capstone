// src/pages/WMSListPage.jsx
import { useState, useEffect } from "react";
import { Table, Button, Typography, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import localforage from "localforage";

const { Title } = Typography;

const WMSListPage = () => {
  const { locomotiveId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);

  const fields = [
    { label: "Title", key: "title", type: "text" },
    { label: "Type", key: "type", type: "select", options: ["Installation", "Commissioning"] },
    { label: "Status", key: "status", type: "select", options: ["Pending", "In Progress", "Completed"] },
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

  useEffect(() => {
    loadWMSData();
  }, [locomotiveId]);

  const loadWMSData = async () => {
    const offlineKey = `offlineWMSList-${locomotiveId}`;

    if (navigator.onLine) {
      // Online: load fresh data and cache it
      const onlineData = [
        { id: "wms1", title: "WMS - Electrical", version: "1.2", status: "In Progress", type: "Installation" },
        { id: "wms2", title: "WMS - Hydraulic", version: "1.0", status: "Pending", type: "Commissioning" },
      ];

      setData(onlineData);
      await localforage.setItem(offlineKey, onlineData);
    } else {
      // Offline: try to load cached data
      const cachedData = await localforage.getItem(offlineKey);
      if (cachedData) {
        setData(cachedData);
        message.info("Currently viewing cached WMS documents.");
      } else {
        message.warning("No cached WMS data found for this locomotive.");
      }
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <Title level={3}>WMS Documents for Locomotive {locomotiveId}</Title>
      <QueryBuilder fields={fields} onApply={applyFilters} onClear={clearFilters} />
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default WMSListPage;