import { FC, ReactNode } from "react";
import styles from "./styles.module.css";

interface Props {
  children: ReactNode;
}

export const DeviceList: FC<Props> = ({ children }) => {
  return <div className={styles.list}>{children}</div>;
};
