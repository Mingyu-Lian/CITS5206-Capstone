// src/pages/Login.jsx
import { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { isStrongPassword } from "../utils/validators";
import users from "../mock/mockUsers"; // ✅ Import mock users

const { Option } = Select;

const mockLogin = async (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      if (user) {
        resolve({
          data: {
            token: "mocked-jwt-token",
            role: user.role,
            discipline: user.discipline,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        reject(new Error("Invalid username or password"));
      }
    }, 1000);
  });
};

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [showDiscipline, setShowDiscipline] = useState(true); // hide for admin

  const onFinish = async (values) => {
    if (!isStrongPassword(values.password)) {
      return message.error(
        "Weak password (must have uppercase, lowercase, number, and 8+ characters)."
      );
    }

    setLoading(true);
    try {
      const { data } = await mockLogin(values.username, values.password);

      // Only require discipline if not Admin
      if (data.role !== "Admin" && !values.discipline) {
        setLoading(false);
        return message.error("Please select a discipline.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("discipline", data.discipline || values.discipline || "");
      localStorage.setItem("name", data.name || "");
      localStorage.setItem("email", data.email || "");

      message.success("Login successful!");

      switch (data.role) {
        case "Admin":
          navigate("/dashboard?role=admin");
          break;
        case "Supervisor":
          navigate("/dashboard?role=supervisor");
          break;
        case "Engineer":
          navigate("/dashboard?role=engineer");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err) {
      message.error("Login failed: Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleValuesChange = (changedValues) => {
    if (changedValues.username !== undefined) {
      const enteredUser = users.find(
        (u) => u.username.toLowerCase() === changedValues.username.toLowerCase()
      );
      if (enteredUser?.role === "Admin") {
        setShowDiscipline(false);
        form.setFieldsValue({ discipline: undefined });
      } else {
        setShowDiscipline(true);
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}>
      <h2>eWMS Login</h2>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        {showDiscipline && (
          <Form.Item
            name="discipline"
            label="Select Discipline"
            rules={[{ required: false }]}
          >
            <Select placeholder="Select a discipline">
              <Option value="Electrical">Electrical</Option>
              <Option value="Mechanical">Mechanical</Option>
              <Option value="Quality">Quality</Option>
              <Option value="Mechanical Electrical">Mechanical Electrical</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="link" onClick={() => navigate("/forgot-password")} block>
            Forgot Password?
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
