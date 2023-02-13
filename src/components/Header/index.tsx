import { HeatMapOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import styles from "./styles.module.css";

const { Title } = Typography;

export const Header = () => {
  return (
    <header className={styles.header}>
      <HeatMapOutlined className={styles.icon} />
      <Title style={{ marginBottom: 0 }}>
        SmartHouse
      </Title>
    </header>
  );
};
