// src/pages/ForgotPassword.jsx
import { Form, Input, Button, message } from "antd";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const onFinish = async (values) => {
    try {
      await forgotPassword(values.email);
      message.success("Reset instructions sent!");
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to send email.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}>
      <h2>Forgot Password</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>Send Reset Link</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
