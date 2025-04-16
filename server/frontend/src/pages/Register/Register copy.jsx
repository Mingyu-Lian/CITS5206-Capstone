import React from 'react';
import { Button, Checkbox, Form, Input, message, Typography } from 'antd';
import { PasswordInput} from 'antd-password-input-strength';
import "./Register.css";
import AppLayout from "../AppLayout";

const onFinish = values => {
  console.log('Success:', values);
  console.log("Received values: ", values);
  message.success("register successful!");
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
  message.error("register failed.");
};
const { Title } = Typography;

const Register = () => (
  <AppLayout>
  <div className="register-container">
    <div className="register-box">
      <Title level={2} className="register-title">
        HITACHI RAIL eWMS System Register
      </Title>

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />

        </Form.Item>
        <Form>
          <Form.Item label="Password">
            <PasswordInput 
            />
          </Form.Item>
        </Form>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  </div >
  </AppLayout>

);
export default Register;
