// src/components/NetworkStatusBar.jsx
import { Alert } from "antd";
import useNetworkStatus from "../utils/useNetworkStatus";

const NetworkStatusBar = () => {
  const online = useNetworkStatus();

  return (
    <Alert
      message={
        online
          ? "🟢 You are Online"
          : "🔴 You are Offline - changes will be saved locally"
      }
      type={online ? "success" : "error"}
      banner
      style={{ textAlign: "center", marginBottom: 16 }}
    />
  );
};

export default NetworkStatusBar;
