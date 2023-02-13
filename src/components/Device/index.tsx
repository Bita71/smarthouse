import { FC, ReactNode } from "react";
import { Card, Popconfirm, Spin } from "antd";
import Image from "next/image";
import styles from "./styles.module.css";
import {
  SettingOutlined,
  DeleteOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";

const { Meta } = Card;

interface Props {
  image: string;
  name: ReactNode;
  children?: ReactNode;
  on: boolean;
  onSettingClick: () => void;
  onPowerClick: () => void;
  onDeleteClick: () => void;
  isPowering?: boolean;
  isDeleting?: boolean;
  
}

export const Device: FC<Props> = ({
  image,
  name,
  children,
  on = false,
  onSettingClick,
  onPowerClick,
  onDeleteClick,
  isPowering = false,
  isDeleting = false,
}) => {
  return (
    <Card
      className={styles.card}
      cover={
        <Image
          className={styles.image}
          alt={name}
          src={image}
          height={220}
          width={250}
        />
      }
      bodyStyle={{ padding: "1em .5em", marginBottom: "auto" }}
      actions={[
        <SettingOutlined
          onClick={onSettingClick}
          style={{ fontSize: "1.25em" }}
          key="setting"
        />,
        <>
          {isPowering ? (
            <Spin />
          ) : (
            <PoweroffOutlined
              disabled={isPowering}
              onClick={onPowerClick}
              style={{ color: on ? "green" : "red", fontSize: "1.25em" }}
              key="power"
            />
          )}
        </>,
        <Popconfirm
          key="delete"
          placement="top"
          title="Вы уверены, что хотите удалить это устройство?"
          description="Данное действие не обратимо"
          onConfirm={onDeleteClick}
          okText="Да"
          cancelText="Нет"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Spin />
          ) : (
            <DeleteOutlined style={{ fontSize: "1.25em" }} key="delete" />
          )}
        </Popconfirm>,
      ]}
    >
      <Meta title={name} />
      {children}
    </Card>
  );
};
