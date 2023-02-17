import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Radio,
  Spin,
  TimePicker,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllColors } from "@/helpers/color";
import styles from "./styles.module.css";
import dayjs, { Dayjs } from "dayjs";
import { createLamp, getLamp, updateLamp } from "@/helpers/lamp";
import { getCleaner, updateCleaner } from "@/helpers/cleaner";
import { getSocket, updateSocket } from "@/helpers/socket";

type DeviceType = "lamp" | "socket" | "cleaner";

interface Props {
  open: boolean;
  onClose: () => void;
  id: string;
  type: DeviceType;
}

interface FormState {
  name: string;
  color: string;
  autoStatus: boolean;
  autoStart: Dayjs;
  autoFinish: Dayjs;
  waterCleaning: boolean;
  cleaningDuration: number;
}

const rules = {
  requiredName: { required: true, message: "Название обязательно" },
  requiredAutoStart: { required: true, message: "Начало режима обязательно" },
  requiredAutoFinish: { required: true, message: "Конец режима обязателен" },
};

export const UpdateModal: FC<Props> = ({ onClose, open, id, type }) => {
  const [form] = Form.useForm<FormState>();
  const [isAutoChecked, setIsAutoChecked] = useState(false);
  const [isWaterCleaning, setIsWaterCleaning] = useState(false);
  const isLamp = type === "lamp";
  const isSocket = type === "socket";
  const isCleaner = type === "cleaner";

  const { data: lamp, isLoading: isLoadingLamp } = useQuery({
    queryKey: ["lamp", id],
    queryFn: () => getLamp(id),
    enabled: open && isLamp,
    onSuccess: ({ autoStatus }) => {
      setIsAutoChecked(autoStatus);
    },
  });

  const { data: cleaner, isLoading: isLoadingCleaner } = useQuery({
    queryKey: ["cleaner", id],
    queryFn: () => getCleaner(id),
    enabled: open && isCleaner,
    onSuccess: ({ waterCleaning }) => {
      setIsWaterCleaning(waterCleaning);
    },
  });

  const { data: socket, isLoading: isLoadingSocket } = useQuery({
    queryKey: ["socket", id],
    queryFn: () => getSocket(id),
    enabled: open && isSocket,
  });

  const { data: colors, isLoading: isLoadingColors } = useQuery({
    queryKey: ["colors"],
    queryFn: getAllColors,
    enabled: open && isLamp,
  });

  const queryClient = useQueryClient();

  const { mutate: mutateLamp, isLoading: isSubmitingLamp } = useMutation({
    mutationFn: updateLamp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lamps"] });
      queryClient.invalidateQueries({ queryKey: ["lamp", id] });
      onClose();
    },
  });

  const { mutate: mutateCleaner, isLoading: isSubmitingCleaner } = useMutation({
    mutationFn: updateCleaner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaners"] });
      queryClient.invalidateQueries({ queryKey: ["cleaner", id] });
      onClose();
    },
  });

  const { mutate: mutateSocket, isLoading: isSubmitingSocket } = useMutation({
    mutationFn: updateSocket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sockets"] });
      queryClient.invalidateQueries({ queryKey: ["socket", id] });
      onClose();
    },
  });

  const handleAutoClick = () => {
    setIsAutoChecked((state) => !state);
  };

  const handleWaterClick = () => {
    setIsWaterCleaning((state) => !state);
  };

  const isSubmiting = isSubmitingCleaner || isSubmitingLamp || isSubmitingSocket;

  const handleSubmit = (values: FormState) => {
    switch (type) {
      case "lamp":
        mutateLamp({
          id,
          lamp: {
            name: values.name.trim(),
            autoStatus: isAutoChecked,
            autoFinish: isAutoChecked
              ? dayjs(values.autoFinish).toDate()
              : undefined,
            autoStart: isAutoChecked
              ? dayjs(values.autoStart).toDate()
              : undefined,
            colorId: values.color,
          },
          log: 'Найстройки устройства обновлены'
        });
        break;
      case "cleaner":
        mutateCleaner({
          id,
          cleaner: {
            name: values.name.trim(),
            waterCleaning: isWaterCleaning,
            cleaningDuration: dayjs(values.cleaningDuration).minute(),
          },
          log: 'Найстройки устройства обновлены'
        });
        break;
      case "socket":
        mutateSocket({
          id,
          socket: {
            name: values.name.trim(),
          },
          log: 'Найстройки устройства обновлены'
        });
        break;
      default:
        break;
    }
  };

  const isLoading =
    (isLamp && (isLoadingColors || isLoadingLamp)) ||
    (isCleaner && isLoadingCleaner)
    || (isSocket && isLoadingSocket);

  return (
    <Modal open={open} onCancel={onClose} footer={[]}>
      {isLoading && (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <Form
          layout="vertical"
          form={form}
          style={{ maxWidth: 600 }}
          onFinish={handleSubmit}
          initialValues={{
            autoStart: lamp?.autoStart ? dayjs(lamp?.autoStart) : undefined,
            autoFinish: lamp?.autoFinish ? dayjs(lamp?.autoFinish) : undefined,
            color: lamp?.colorId,
            name: lamp?.name || cleaner?.name || socket?.name,
            cleaningDuration: cleaner?.cleaningDuration
              ? dayjs().startOf("day").add(cleaner?.cleaningDuration, "minute")
              : undefined,
            waterCleaning: cleaner?.waterCleaning,
          }}
        >
          <Form.Item
            rules={[rules.requiredName]}
            name="name"
            label="Название устройства"
          >
            <Input />
          </Form.Item>

          {!isLoadingColors && isLamp && (
            <>
              <Form.Item name="color" label="Цвет света">
                <Radio.Group>
                  {colors?.map((color) => (
                    <Radio.Button
                      key={color.id}
                      value={color.id}
                      style={{ color: color.hex }}
                    >
                      {color.name}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <Checkbox checked={isAutoChecked} onChange={handleAutoClick}>
                  Автоматический режим
                </Checkbox>
              </Form.Item>
              {isAutoChecked && (
                <>
                  <Form.Item rules={[rules.requiredAutoStart]} name="autoStart">
                    <TimePicker
                      allowClear={false}
                      placeholder="Начало"
                      format="HH:mm"
                      defaultOpenValue={dayjs("09:00", "HH:mm")}
                    />
                  </Form.Item>
                  <Form.Item
                    rules={[rules.requiredAutoFinish]}
                    name="autoFinish"
                  >
                    <TimePicker
                      allowClear={false}
                      placeholder="Конец"
                      format="HH:mm"
                      defaultOpenValue={dayjs("23:00", "HH:mm")}
                    />
                  </Form.Item>
                </>
              )}
            </>
          )}
          {isCleaner && (
            <>
              <Form.Item label="Длительность уборки" name="cleaningDuration">
                <TimePicker
                  allowClear={false}
                  placeholder="Минуты"
                  format="mm"
                  showNow={false}
                />
              </Form.Item>
              <Form.Item>
                <Checkbox checked={isWaterCleaning} onClick={handleWaterClick}>
                  Влажная уборка
                </Checkbox>
              </Form.Item>
            </>
          )}
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={isSubmiting}>
              Изменить
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
