import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { isStrongPassword } from "../utils/validators";

// Mock login function
const mockLogin = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          token: "mocked-jwt-token",
          role: email.includes("admin") ? "Admin" :
                email.includes("supervisor") ? "Supervisor" : "Engineer"
        }
      });
    }, 1000);
  });
};

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    if (!isStrongPassword(values.password)) {
      return message.error("Weak password (uppercase, lowercase, number, 8+ chars).");
    }

    setLoading(true);
    try {
      const { data } = await mockLogin(values.email, values.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
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
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}>
      <h2>eWMS Login</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Login</Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={() => navigate("/forgot-password")}>Forgot Password?</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
