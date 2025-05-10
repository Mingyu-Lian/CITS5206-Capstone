// src/pages/Login.jsx
import { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { isStrongPassword } from "../utils/validators";
import users from "../mock/mockUsers"; // ✅ Import real users list
import axios from "axios";
const { Option } = Select;

// ✅ New real login function
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
          }
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [form] = Form.useForm(); // Form instance

  const onFinish = async (values) => {
    
    //if (!isStrongPassword(values.password)) {
    //    return message.error("Weak password (must have uppercase, lowercase, number, and 8+ characters).");

   //}

    if (!values.discipline && !isAdmin) {
      return message.error("Please select a discipline.");
    } 
    //

    setLoading(true);

    try {
      //const { data } = await mockLogin(values.username, values.password);
      const { data } = await axios.post("http://localhost:5001/api/auth/login", {
        username: values.username,
        password: values.password,
        selectedDiscipline: isAdmin ? null : values.discipline,
      });
      console.log("Response data:", data); 

        // 1) Destructure correctly
      const { token, user } = data;
      const { id, username, role, selectedDiscipline,email } = user;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "");
      localStorage.setItem("discipline", selectedDiscipline || "");
      localStorage.setItem("name",username || "");
      localStorage.setItem("email",email || "");
      message.success("Login successful!");

      switch (data.role) {
        case "admin":
          navigate("/dashboard?role=admin");
          break;
        case "supervisor":
          navigate("/dashboard?role=supervisor");
          break;
        case "engineer":
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
