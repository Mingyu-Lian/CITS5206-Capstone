import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Popconfirm,
  Tag,
  Dropdown,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";

const roles = ["Admin", "Supervisor", "Engineer"];
const currentRole = (localStorage.getItem("role") || "").trim();
const currentEmail = (localStorage.getItem("email") || "").trim();

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("All");
  const [columnVisibility, setColumnVisibility] = useState({
    name: true,
    email: true,
    role: true,
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userList"));
    if (stored?.length) {
      setUsers(stored);
    } else {
      const initial = [
        { id: 1, name: "Admin User", email: "admin@example.com", role: "Admin" },
        { id: 2, name: "Supervisor Jane", email: "jane@company.com", role: "Supervisor" },
        { id: 3, name: "Engineer John", email: "john@company.com", role: "Engineer" }
      ];
      localStorage.setItem("userList", JSON.stringify(initial));
      setUsers(initial);
    }
  }, []);

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) form.setFieldsValue(user);
    else form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();

    if (!editingUser && currentRole !== "Admin") {
      message.error("Only Admins can add users.");
      return;
    }

    if (
      editingUser &&
      currentRole === "Supervisor" &&
      editingUser.email !== currentEmail
    ) {
      message.error("Supervisors can only edit their profile.");
      return;
    }

    let updatedUsers = [...users];
    if (editingUser) {
      const index = users.findIndex((u) => u.id === editingUser.id);
      updatedUsers[index] = { ...editingUser, ...values };
      message.success("User updated");
    } else {
      updatedUsers.push({ ...values, id: Date.now() });
      message.success("User created");
    }

    setUsers(updatedUsers);
    localStorage.setItem("userList", JSON.stringify(updatedUsers));
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem("userList", JSON.stringify(updated));
    message.success("User deleted");
  };

  const canEdit = (user) => {
    if (currentRole === "Admin") return true;
    if (currentRole === "Supervisor") {
      return user.email === currentEmail;
    }
    return false;
  };

  const exportToCSV = () => {
    const csv = unparse(users);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "user_data.csv");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const roleFilteredUsers = filteredUsers.filter((user) =>
    activeRoleFilter === "All" ? true : user.role === activeRoleFilter
  );

  const visibleColumns = [];

  if (columnVisibility.name) {
    visibleColumns.push({
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    });
  }

  if (columnVisibility.email) {
    visibleColumns.push({
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    });
  }

  if (columnVisibility.role) {
    visibleColumns.push({
      title: "Role",
      dataIndex: "role",
    });
  }

  visibleColumns.push({
    title: "Actions",
    render: (_, record) => (
      <>
        <Button icon={<EyeOutlined />} onClick={() => openModal(record)} style={{ marginRight: 8 }} />
        {canEdit(record) && (
          <Button icon={<EditOutlined />} onClick={() => openModal(record)} style={{ marginRight: 8 }} />
        )}
        {currentRole === "Admin" && (
          <Popconfirm title="Delete user?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        )}
      </>
    ),
  });

  const queryMenu = (
    <div
      style={{
        padding: 16,
        maxWidth: 300,
        backgroundColor: "#f0f2f5", // background 
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Input.Search
        placeholder="Search by name or email"
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: "100%" }}
      />
  
      <div style={{ marginBottom: 16 }}>
        <strong>Filter by Role:</strong><br />
        {["All", "Admin", "Supervisor", "Engineer"].map((role) => (
          <Tag.CheckableTag
            key={role}
            checked={activeRoleFilter === role}
            onChange={() => setActiveRoleFilter(role)}
          >
            {role}
          </Tag.CheckableTag>
        ))}
      </div>
  
      <div style={{ marginBottom: 16 }}>
        <strong>Visible Columns:</strong><br />
        {Object.keys(columnVisibility).map((colKey) => (
          <label key={colKey} style={{ display: "inline-block", marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={columnVisibility[colKey]}
              onChange={(e) =>
                setColumnVisibility({
                  ...columnVisibility,
                  [colKey]: e.target.checked,
                })
              }
            />{" "}
            {colKey.charAt(0).toUpperCase() + colKey.slice(1)}
          </label>
        ))}
      </div>
  
      <Button block onClick={exportToCSV}>
        Export to CSV
      </Button>
    </div>
  );
  

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>User Management</Typography.Title>

      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between" }}>
        {currentRole === "Admin" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            Add User
          </Button>
        )}

        <Dropdown overlay={queryMenu} trigger={["click"]} placement="bottomRight">
          <Button icon={<FilterOutlined />}>
            Query Options <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <Table
        rowKey="id"
        dataSource={roleFilteredUsers}
        columns={visibleColumns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }, { max: 50 }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true }, { type: "email" }]}
          >
            <Input placeholder="Email address" disabled={editingUser && currentRole !== "Admin"} />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true }]}
          >
            <Select disabled={currentRole !== "Admin"}>
              {roles.map((r) => (
                <Select.Option key={r} value={r}>{r}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
