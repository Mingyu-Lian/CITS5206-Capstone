import { useState, useEffect } from "react";
import {
  Table, Button, Modal, Form, Input, Select, Typography, Popconfirm, Tag, message
} from "antd";
import {
  EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined
} from "@ant-design/icons";

const { Option } = Select;
const currentRole = (localStorage.getItem("role") || "").trim();
const currentEmail = (localStorage.getItem("email") || "").trim();
const isRestricted = ["Engineer", "Supervisor"].includes(currentRole);


const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [form] = Form.useForm();
  const [editingProject, setEditingProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("projectList"));
    if (stored?.length) {
      setProjects(stored);
    } else {
      const initial = [
        {
          id: 1,
          name: "Train Overhaul A",
          status: "Ongoing",
          supervisor: "jane@company.com",
          engineers: ["john@company.com"],
          description: "Overhaul task for Unit A"
        }
      ];
      localStorage.setItem("projectList", JSON.stringify(initial));
      setProjects(initial);
    }
  }, []);

  const openModal = (record = null) => {
    setEditingProject(record);
    record ? form.setFieldsValue(record) : form.resetFields();
    setVisibleModal(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();

    if (isRestricted) {
      const updated = projects.map(p =>
        p.id === editingProject.id ? { ...p, status: values.status } : p
      );
      setProjects(updated);
      localStorage.setItem("projectList", JSON.stringify(updated));
      message.success("Project status updated");
      setVisibleModal(false);
      return;
    }

    const updated = [...projects];
    if (editingProject) {
      const index = updated.findIndex(p => p.id === editingProject.id);
      updated[index] = { ...editingProject, ...values };
      message.success("Project updated");
    } else {
      updated.push({ ...values, id: Date.now(), engineers: [] });
      message.success("Project created");
    }

    setProjects(updated);
    localStorage.setItem("projectList", JSON.stringify(updated));
    setVisibleModal(false);
  };

  const handleDelete = (id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("projectList", JSON.stringify(updated));
    message.success("Project deleted");
  };

  const handleAssignEngineer = (projectId, engineerEmail) => {
    const updated = projects.map(p =>
      p.id === projectId && !p.engineers.includes(engineerEmail)
        ? { ...p, engineers: [...p.engineers, engineerEmail] }
        : p
    );
    setProjects(updated);
    localStorage.setItem("projectList", JSON.stringify(updated));
    message.success("Engineer assigned");
  };

  const filteredProjects = projects.filter(p =>
    filterStatus === "All" ? true : p.status === filterStatus
  );

  const columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Ongoing", value: "Ongoing" },
        { text: "Completed", value: "Completed" }
      ],
      onFilter: (value, record) => record.status === value,
      render: status => <Tag color={status === "Completed" ? "green" : "blue"}>{status}</Tag>
    },
    {
      title: "Supervisor",
      dataIndex: "supervisor"
    },
    {
      title: "Engineers",
      dataIndex: "engineers",
      render: engs => engs.join(", ")
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => openModal(record)} style={{ marginRight: 8 }} />

          {(currentRole === "Admin" || currentRole === "Supervisor") && (
            <Button icon={<EditOutlined />} onClick={() => openModal(record)} style={{ marginRight: 8 }} />
          )}

          {currentRole === "Admin" && (
            <Popconfirm title="Delete project?" onConfirm={() => handleDelete(record.id)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}

          {currentRole === "Supervisor" && (
            <Select
              placeholder="Assign Engineer"
              onChange={(val) => handleAssignEngineer(record.id, val)}
              style={{ width: 180, marginTop: 8 }}
            >
              <Option value="john@company.com">john@company.com</Option>
              <Option value="emma@company.com">emma@company.com</Option>
            </Select>
          )}
        </>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Project Management</Typography.Title>

      {currentRole === "Admin" && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          style={{ marginBottom: 16 }}
        >
          Add Project
        </Button>
      )}

      <Select
        defaultValue="All"
        onChange={setFilterStatus}
        style={{ width: 200, marginBottom: 16, marginLeft: 16 }}
      >
        <Option value="All">All</Option>
        <Option value="Ongoing">Ongoing</Option>
        <Option value="Completed">Completed</Option>
      </Select>

      <Table
        rowKey="id"
        dataSource={filteredProjects}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingProject ? "Edit Project" : "Create Project"}
        open={visibleModal}
        onCancel={() => setVisibleModal(false)}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Project Name" rules={[{ required: true }]}>
            <Input disabled={isRestricted} />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select disabled={false}>
              <Option value="Ongoing">Ongoing</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>
          <Form.Item name="supervisor" label="Supervisor Email" rules={[{ required: true, type: "email" }]}>
            <Input disabled={isRestricted} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} disabled={isRestricted} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;
