import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from React Router

import { Button, Checkbox, Form, Input, message, Typography, Select } from 'antd';
import { PasswordInput } from 'antd-password-input-strength';
import "./Register.css";

const { Title } = Typography;

const Register = () => {
  const { Option } = Select;

  const [level, setLevel] = useState(0)
  const [loading, setLoading] = useState(false);
  const minLevel = 1;
  const errorMessage = 'Password is too weak';
  const [registerForm] = Form.useForm(); // Ant Design's form instance
  const [validationErrors, setValidationErrors] = useState([]); // State to store validation errors

  // Custom password validation function
  const validatePassword = (_, password) => {
    const errors = [];

    // Check if the password exists
    if (!password) {
      errors.push("Password is required.");
    } else {
      // Check for at least 8 characters
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters.");
      }

      // Check for a lowercase letter
      if (!/[a-z]/.test(password)) {
        errors.push("Password must include at least one lowercase letter.");
      }

      // Check for an uppercase letter
      if (!/[A-Z]/.test(password)) {
        errors.push("Password must include at least one uppercase letter.");
      }

      // Check for a number
      if (!/[0-9]/.test(password)) {
        errors.push("Password must include at least one number.");
      }

      // Check for a special character
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push("Password must include at least one special character.");
      }
    }

    // If there are errors, reject the promise
    if (errors.length > 0) {
      setValidationErrors(errors); // Update the state with the errors
      return Promise.reject(); // Reject without showing the error inline
    }

    // If no errors, resolve the promise
    setValidationErrors([]); // Clear the errors
    return Promise.resolve();
  };
  const handleChangeRole = (value) => {
    // console.log(`selected ${value}`);
    console.log("Selected role:", value);
    registerForm.setFieldsValue({ role: value });
  };
  const handleSubmit = async (values) => {
    console.log("Form values submitted:", values);

    // Mock API endpoint
    const apiUrl = "https://backend-api.com/register";

    try {
      setLoading(true);

      // Send data to backend using Axios or Fetch
      const response = await axios.post(apiUrl, values);

      // Handle success response
      if (response.status === 200) {
        message.success("Register successful!");
        console.log("API Response:", response.data);
      }
    } catch (error) {
      // Handle error response
      console.error("API Error:", error);
      message.error("Register failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    message.error("register failed.");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <Title level={2} className="register-title">
          HITACHI RAIL eWMS System Register
        </Title>

        <Form
          name="registerForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please enter your first name." },
            ]}
          >
            <Input allowClear placeholder="First name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please enter your last name." },
            ]}
          >
            <Input allowClear placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter your username." },
            ]}
          >
            <Input allowClear placeholder="username." />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            allowClear
            rules={[
              { required: true, message: "Please enter your email." },
              { type: "email", message: "Please enter a valid email address." },
            ]}
          >
            <Input placeholder="email address" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select your role." }]}
          >
            <Select
              initialValues="Engineer"
              // style={{ width: 120 }}
              onChange={handleChangeRole}
              options={[
                {
                  value: 'admin',
                  label: 'Admin',
                },
                {
                  value: 'supervisor',
                  label: 'Supervisor',
                },
                {
                  value: 'engineer',
                  label: 'Engineer',
                },
              ]}
            />
            {/* <Select initialValues="Engineer"
              onChange={handleChangeRole} >
              <Option value="admin">Admin</Option>
              <Option value="supervisor">Supervisor</Option>
              <Option value="engineer">Engineer</Option>


            </Select> */}

          </Form.Item>
          {/* Password Input */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password." },
              { validator: validatePassword }, // Use the custom validator
            ]}
            validateFirst // Ensures all rules are checked in order
            validateTrigger="onSubmit" // Only validate on form submission

          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {/* Display Validation Errors */}
          {validationErrors.length > 0 && (
            <div style={{ marginBottom: 16, color: "red" }}>
              <ul>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />

        </Form.Item> */}

          {/* <Form.Item label="Password"

            name="password"
            rules={[{
              validator: async () => {
                return level >= minLevel ? Promise.resolve() : Promise.reject(errorMessage);
              },
              message: errorMessage
            }]}
          >
            <PasswordInput
              // settings={{

              // }}
              // passwordinputsettings={{
              //   // colorScheme: [{
              //   //   levels: ["#ff4033", "#ffd908", "#6ecc3a"],
              //   //   noLevel: "lightgrey"

              //   // }],

              //   colorScheme: {
              //     levels: ["#ff4033", "#fe940d", "#ffd908", "#cbe11d", "#6ecc3a"],
              //     noLevel: "lightgrey"
              // },
              // }}
               
              onLevelChange={setLevel}

              placeholder="Please enter strong password."
            />
          </Form.Item> */}

      

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            <Link to="/login" style={{ textAlign: "center", display: "block", marginTop: "16px" }}>
              Already a user? Go to Login Page
            </Link>
          </Form.Item>


        </Form>
      </div>
    </div >

  );
};
export default Register;
