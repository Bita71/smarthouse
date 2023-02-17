import { Events, State } from "@/store";
import cx from "classnames";
import { ApiOutlined, HeatMapOutlined, ReadOutlined } from "@ant-design/icons";
import { Button, TimePicker, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useStoreon } from "storeon/react";
import styles from "./styles.module.css";
import { LogsModal } from "../LogsModal";

const { Title } = Typography;

const Header = () => {
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const timer = useRef<NodeJS.Timer>();
  const { dispatch, time } = useStoreon<State, Events>("time");
  const { on } = useStoreon<State, Events>("on");

  useEffect(() => {
    if (!on) {
      clearTimeout(timer.current);
      return;
    }
    timer.current = setTimeout(
      () => dispatch("set", time.add(1, "second")),
      1000
    );

    return () => {
      clearTimeout(timer.current);
    };
  }, [dispatch, on, time]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      dispatch("off");
    } else {
      dispatch("on");
    }
  };

  const handleChange = (value: Dayjs | null) => {
    if (value) {
      dispatch("set", value);
    }
  };

  const isNotNow = !dayjs().isSame(time, 'minute');

  const handleLogsOpen = () => setIsLogsOpen(true);
  const handleLogsClose = () => setIsLogsOpen(false);
  return (
    <header className={styles.header}>
      <HeatMapOutlined className={styles.icon} />
      <Title style={{ marginBottom: 0, marginRight: "auto" }}>SmartHouse</Title>
      <ApiOutlined
        className={cx(styles.disconnect, { [styles.on]: isNotNow })}
      />
      <TimePicker
        size="large"
        allowClear={false}
        value={time}
        placeholder="Время"
        format="HH:mm:ss"
        onOpenChange={handleOpenChange}
        onChange={handleChange}
      />
      <Button onClick={handleLogsOpen} className={styles.log} type="text">
        <ReadOutlined />
      </Button>
      <LogsModal open={isLogsOpen} onClose={handleLogsClose} />
    </header>
  );
};

export default Header;
