import { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { isStrongPassword } from "../utils/validators";

const { Option } = Select;

const mockLogin = async (username, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          token: "mocked-jwt-token",
          role: username.includes("admin") ? "Admin" :
                username.includes("supervisor") ? "Supervisor" : "Engineer"
        }
      });
    }, 1000);
  });
};

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [form] = Form.useForm(); // 🌟 Create form instance

  const onFinish = async (values) => {
    if (!isStrongPassword(values.password)) {
      return message.error("Weak password (must have uppercase, lowercase, number, and 8+ characters).");
    }

    if (!values.discipline && !isAdmin) {
      return message.error("Please select a discipline.");
    }

    setLoading(true);
    try {
      const { data } = await mockLogin(values.username, values.password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (data.role !== "Admin") {
        localStorage.setItem("discipline", values.discipline);
      }
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

  // 🌟 Detect username changes correctly using Form event
  const handleValuesChange = (changedValues) => {
    if (changedValues.username !== undefined) {
      const username = changedValues.username.toLowerCase();
      if (username.includes("admin")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
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
        onValuesChange={handleValuesChange} // 🌟 properly detect username
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

        <Form.Item
          name="discipline"
          label="Select Discipline"
          rules={[{ required: false }]}
        >
          <Select
            placeholder={isAdmin ? "Discipline not required for Admin" : "Select a discipline"}
            disabled={isAdmin}
          >
            <Option value="Electrical">Electrical</Option>
            <Option value="Mechanical">Mechanical</Option>
            <Option value="Quality">Quality</Option>
            <Option value="Mechanical Electrical">Mechanical Electrical</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            type="link"
            onClick={() => navigate("/forgot-password")}
            block
          >
            Forgot Password?
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
