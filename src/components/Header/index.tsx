import { Events, State } from "@/store";
import cx from "classnames";
import { ApiOutlined, HeatMapOutlined } from "@ant-design/icons";
import { TimePicker, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useRef } from "react";
import { useStoreon } from "storeon/react";
import styles from "./styles.module.css";

const { Title } = Typography;

const Header = () => {
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
    </header>
  );
};

export default Header;
