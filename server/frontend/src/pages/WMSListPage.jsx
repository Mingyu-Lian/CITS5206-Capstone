// src/pages/WMSListPage.jsx
import { useState, useEffect } from "react";
import { Table, Button, Typography, Modal, Form, Input, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import QueryBuilder from "../components/QueryBuilder";
import { UploadOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import localforage from "localforage";
import { cacheLocomotiveData, getCachedLocomotiveData } from "../utils/offlineSyncHelper";


const { Title } = Typography;
const { Option } = Select;

const WMSListPage = () => {
  const { locomotiveId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const role = localStorage.getItem("role");

  const fields = [
    { label: "Title", key: "title", type: "text" },
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

  const handleCreateWMS = async (values) => {
    const newWMS = {
      wmsId: `WMS-${Math.floor(1000 + Math.random() * 9000)}`,
      title: values.title,
      type: values.type,
      file: values.file?.file?.name || null,
      tasks: [],
    };
  
    let locoData = await getCachedLocomotiveData(locomotiveId);
  
    if (!locoData) {
      locoData = {
        locomotiveId,
        name: `Locomotive ${locomotiveId}`,
        baseline: "v1.0",
        wmsList: [],
      };
    }
  
    locoData.wmsList.push(newWMS);
    setData(locoData.wmsList);
  
    await cacheLocomotiveData(locomotiveId, locoData);
  
    message.success("WMS Document uploaded and cached successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };  

  const loadWMSData = async () => {
    let cachedLocoData = await getCachedLocomotiveData(locomotiveId);
  
    if (cachedLocoData) {
      setData(cachedLocoData.wmsList);
      message.info("Loaded WMS documents from cache.");
    } else if (navigator.onLine) {
      const onlineData = {
        locomotiveId: "Loco-001",
        name: "Locomotive A",
        baseline: "v3.0",
        wmsList: [
          {
            wmsId: "wms1",
            title: "WMS - Electrical",
            type: "Installation",
            tasks: [
              {
                taskId: "task1",
                title: "Check Fuse Box",
                status: "Pending",
                subtasks: [
                  { id: "sub1", instruction: "Verify voltage levels.", result: "", signedOff: false, discipline: "Electrical" },
                  { id: "sub2", instruction: "Capture photo of connected cable.", result: "", signedOff: false, discipline: "Mechanical" },
                ],
              },
              {
                taskId: "task2",
                title: "Install Cabling",
                status: "Signed Off",
                subtasks: [
                  { id: "sub7", instruction: "Inspect insulation on cabling.", result: "", signedOff: false, discipline: "Electrical" },
                  { id: "sub8", instruction: "Secure loose cables.", result: "", signedOff: false, discipline: "Mechanical" },
                ],
              },
            ],
          },
          {
            wmsId: "wms2",
            title: "WMS - Hydraulic",
            type: "Commissioning",
            tasks: [
              {
                taskId: "task3",
                title: "Inspect Brake System",
                status: "Pending",
                subtasks: [
                  { id: "sub3", instruction: "Inspect brake pads wear", result: "", signedOff: false, discipline: "Mechanical" },
                  { id: "sub4", instruction: "Check brake fluid levels", result: "", signedOff: false, discipline: "Mechanical" },
                ],
              },
              {
                taskId: "task4",
                title: "Replace Battery Module",
                status: "In Progress",
                subtasks: [
                  { id: "sub5", instruction: "Remove old battery", result: "", signedOff: false, discipline: "Electrical" },
                  { id: "sub6", instruction: "Install new battery", result: "", signedOff: false, discipline: "Electrical" },
                ],
              },
            ],
          },
        ],
      };      
  
      setData(onlineData.wmsList);
      await cacheLocomotiveData(locomotiveId, onlineData);
      message.success("Fetched and cached online WMS documents.");
    } else {

      message.warning("Offline and no cached data available.");
    }
  
    setLoading(false);
  };  

  useEffect(() => {
    loadWMSData();
  }, [locomotiveId]);

  if (loading) return <div>Loading WMS Documents...</div>;

  return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>WMS Documents for Locomotive {locomotiveId}</Title>

          {role === "Admin" && (
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

        <Modal
          title="Upload New WMS Document"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleCreateWMS}>
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
  );
};

export default WMSListPage;
