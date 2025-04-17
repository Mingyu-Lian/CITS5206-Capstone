import React, { useState } from "react";
import axios from "axios"; 
import { Link } from "react-router-dom"; // Import Link from React Router
import { Button, Checkbox, Form, Input, message, Select, Typography } from 'antd';
import { PasswordInput } from 'antd-password-input-strength';
import "./Login.css";
const { Option } = Select;

const { Title } = Typography;
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginForm] = Form.useForm(); // Ant Design's form instance

  const handleChangeRole = (value) => {
    // console.log(`selected ${value}`);
    console.log("Selected role:", value);
    loginForm.setFieldsValue({ role: value });
  };
  const handleSubmit = async (values) => {
    console.log("Form values submitted:", values);

    // Mock API endpoint
    const apiUrl = "https://backend-api.com/login";

    try {
      setLoading(true);

      // Send data to backend using Axios or Fetch
      const response = await axios.post(apiUrl, values);

      // Handle success response
      if (response.status === 200) {
        message.success("Login successful!");
        console.log("API Response:", response.data);
      }
    } catch (error) {
      // Handle error response
      console.error("API Error:", error);
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={2} className="login-title">
          HITACHI RAIL eWMS System Login
        </Title>

        <Form
          name="loginForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input allowClear/>
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select your role." }]}
          >
            <Select initialValues="Engineer"
              onChange={handleChangeRole} >
              <Option value="admin">Admin</Option>
              <Option value="supervisor">Supervisor</Option>
              <Option value="engineer">Engineer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password allowClear/>

          </Form.Item>


          <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to="/register" style={{ textAlign: "center", display: "block", marginTop: "16px" }}>
              Not a user? Go to Register Page
            </Link>
          </Form.Item>
        </Form>
      </div>
    </div >


  );
};
export default Login;
