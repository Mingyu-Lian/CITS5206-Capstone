// src/pages/UserManagement.jsx
import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchUsers, addUser, deleteUser, updateUser } from "../mock/mockApi";

const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const role = localStorage.getItem("role");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterDiscipline, setFilterDiscipline] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers([...data]);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filterRole, filterDiscipline, searchText]);

  const applyFilters = () => {
    let filtered = [...users];
    if (filterRole !== "All") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }
    if (filterDiscipline !== "All") {
      filtered = filtered.filter((user) => user.discipline === filterDiscipline);
    }
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (userId) => {
    if (role !== "Admin") return message.error("Permission denied.");
    const success = await deleteUser(userId);
    if (success) {
      message.success("User deleted successfully!");
      await loadUsers();
    } else {
      message.error("Failed to delete user.");
    }
  };

  const handleFinish = async (values) => {
    if (role !== "Admin") return message.error("Permission denied.");
    if (editingUser) {
      await updateUser(editingUser.id, values);
      message.success("User updated successfully!");
    } else {
      const newUser = {
        ...values,
        id: `user-${Math.floor(1000 + Math.random() * 9000)}`,
        createdDate: new Date().toISOString().split("T")[0],
      };
      await addUser(newUser);
      message.success("User added successfully!");
    }
    setIsModalVisible(false);
    await loadUsers();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "Supervisor", value: "Supervisor" },
        { text: "Engineer", value: "Engineer" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Discipline",
      dataIndex: "discipline",
      key: "discipline",
      filters: [
        { text: "Electrical", value: "Electrical" },
        { text: "Mechanical", value: "Mechanical" },
        { text: "Software", value: "Software" },
        { text: "Quality", value: "Quality" },
        { text: "Mechanical Electrical", value: "Mechanical Electrical" },
      ],
      onFilter: (value, record) => record.discipline === value,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        role === "Admin" ? (
          <>
            <Button icon={<EditOutlined />} onClick={() => openEditUserModal(record)} type="link">
              Edit
            </Button>
            <Popconfirm title="Are you sure to delete this user?" onConfirm={() => handleDeleteUser(record.id)}>
              <Button icon={<DeleteOutlined />} type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        ) : null,
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>User Management</Title>
        {role === "Admin" && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddUserModal}>
            Add User
          </Button>
        )}
      </div>

      {/* Filter Section */}
      <div className="flex gap-4 mb-4">
        <Select value={filterRole} onChange={setFilterRole} style={{ width: 180 }}>
          <Option value="All">All Roles</Option>
          <Option value="Admin">Admin</Option>
          <Option value="Supervisor">Supervisor</Option>
          <Option value="Engineer">Engineer</Option>
        </Select>

        <Select value={filterDiscipline} onChange={setFilterDiscipline} style={{ width: 220 }}>
          <Option value="All">All Disciplines</Option>
          <Option value="Electrical">Electrical</Option>
          <Option value="Mechanical">Mechanical</Option>
          <Option value="Software">Software</Option>
          <Option value="Quality">Quality</Option>
          <Option value="Mechanical Electrical">Mechanical Electrical</Option>
        </Select>

        <Input.Search
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by Name or Email"
          allowClear
          style={{ width: 240 }}
        />
      </div>

      {/* User Table */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredUsers}
        bordered
        pagination={{ pageSize: 8 }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select Role">
              <Option value="Admin">Admin</Option>
              <Option value="Supervisor">Supervisor</Option>
              <Option value="Engineer">Engineer</Option>
            </Select>
          </Form.Item>
          <Form.Item name="discipline" label="Discipline" rules={[{ required: true }]}>
            <Select placeholder="Select Discipline">
              <Option value="Electrical">Electrical</Option>
              <Option value="Mechanical">Mechanical</Option>
              <Option value="Software">Software</Option>
              <Option value="Quality">Quality</Option>
              <Option value="Mechanical Electrical">Mechanical Electrical</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
