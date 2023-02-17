import { FC, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  DatePicker,
  Form,
  List,
  Modal,
  Pagination,
  Select,
  TimePicker,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { getAllLogs } from "@/helpers/log";
import { LogType } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import styles from "./styles.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
}

const images = {
  [LogType.LAMP]: "/lamp.webp",
  [LogType.SOCKET]: "/socket.png",
  [LogType.CLEANER]: "/cleaner.webp",
};

const options = [
  { value: LogType.LAMP, label: "Лампочка" },
  { value: LogType.SOCKET, label: "Розетка" },
  { value: LogType.CLEANER, label: "Робот-пылесос" },
];

export const LogsModal: FC<Props> = ({ onClose, open }) => {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<LogType | null>(null);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const { data, isLoading } = useQuery({
    queryKey: ["logs", page, type, startDate, endDate],
    queryFn: () =>
      getAllLogs({
        skip: (page - 1) * 5,
        type: type ? type : undefined,
        startDate: startDate ? dayjs(startDate).toDate() : undefined,
        endDate: endDate ? dayjs(endDate).toDate() : undefined
      }),
    staleTime: 30000,
  });

  const handlePageChange = (page: number) => setPage(page);
  const handleTypeChange = (type: LogType | null) => setType(type);

  const handleDateChange = ([start, end]: [Dayjs | undefined, Dayjs | undefined] = [undefined, undefined]) => {
    if (start) {
      setStartDate(start.toString())
    } else {
      setStartDate(undefined);
    }

    if (end) {
      setEndDate(end.toString())
    } else {
      setEndDate(undefined);
    }
  }
  DatePicker.RangePicker.propTypes

  const date = [
    startDate ? dayjs(startDate) : undefined,
    endDate ? dayjs(endDate) : undefined
  ]

  return (
    <Modal width={700} open={open} title="Журнал действий" onCancel={onClose} footer={[]}>
      <div style={{ marginBottom: "1em" }}>
        <Select
          style={{ width: 180, marginRight: "1em" }}
          placeholder="Тип устройства"
          value={type}
          onChange={handleTypeChange}
          options={options}
          allowClear
        />
        <DatePicker.RangePicker
          showTime={{ format: 'HH:mm' }}
          format="DD.MM.YYYY HH:mm"
          value={date as any}
          allowEmpty={[true, true]}
          onChange={handleDateChange as any}
          placeholder={['Начало периода', 'Конец периода']}
          allowClear
        />
      </div>
      <List
        loading={isLoading}
        dataSource={data?.logs}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`/images${images[item.type]}`} />}
              title={item.name}
              description={item.text}
            />
            <span style={{ color: "gray" }}>
              {dayjs(item.time).format("HH:mm DD.MM.YYYY")}
            </span>
          </List.Item>
        )}
      />
      {Boolean(data?.count) && (
        <Pagination
          style={{ textAlign: "center", marginTop: "1em" }}
          current={page}
          onChange={handlePageChange}
          pageSize={5}
          total={data?.count}
        />
      )}
    </Modal>
  );
};
