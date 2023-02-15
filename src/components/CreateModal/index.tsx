import React, { useState } from "react";
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
import { createLamp } from "@/helpers/lamp";
import { createCleaner } from "@/helpers/cleaner";
import { createSocket } from "@/helpers/socket";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  color: string;
  type: DeviceType;
  autoStart: Dayjs;
  autoFinish: Dayjs;
  cleaningDuration: Dayjs;
}

type DeviceType = "lamp" | "socket" | "cleaner";

const rules = {
  requiredName: { required: true, message: "Название обязательно" },
  requiredType: { required: true, message: "Тип устройства обязателен" },
  requiredAutoStart: { required: true, message: "Начало режима обязательно" },
  requiredAutoFinish: { required: true, message: "Конец режима обязателен" },
};

export const CreateModal: React.FC<Props> = ({ onClose, open }) => {
  const [form] = Form.useForm<FormState>();
  const [type, setType] = useState<DeviceType | null>(null);
  const [isAutoChecked, setIsAutoChecked] = useState(false);
  const [isWaterCleaning, setIsWaterCleaning] = useState(false);
  const isLamp = type === "lamp";
  const isSocket = type === "socket";
  const isCleaner = type === "cleaner";

  const { data: colors, isLoading: isLoadingColors } = useQuery({
    queryKey: ["colors"],
    queryFn: getAllColors,
    enabled: open && isLamp,
    onSuccess: (data) => {
      form.setFieldValue("color", data?.[0]?.id);
    },
  });

  const queryClient = useQueryClient();

  const succesCreating = () => {
    setType(null);
    setIsAutoChecked(false);
    setIsWaterCleaning(false);
    form.resetFields();
    onClose();
  }

  const { mutate: mutateLamp, isLoading: isSubmitingLamp } = useMutation({
    mutationFn: createLamp,
    onSuccess: () => {
      succesCreating();
      queryClient.invalidateQueries({ queryKey: ["lamps"] });
    },
  });

  const { mutate: mutateCleaner, isLoading: isSubmitingCleaner } = useMutation({
    mutationFn: createCleaner,
    onSuccess: () => {
      succesCreating();
      queryClient.invalidateQueries({ queryKey: ["cleaners"] });
    },
  });

  const { mutate: mutateSocket, isLoading: isSubmitingSocket } = useMutation({
    mutationFn: createSocket,
    onSuccess: () => {
      succesCreating();
      queryClient.invalidateQueries({ queryKey: ["sockets"] });
    },
  });

  const isSubmiting = isSubmitingLamp || isSubmitingCleaner || isSubmitingSocket;

  const handleAutoClick = () => {
    setIsAutoChecked((state) => !state);
  };

  const handleWaterClick = () => {
    setIsWaterCleaning((state) => !state);
  };

  const handleSubmit = (values: FormState) => {
    console.log(values);
    switch (values.type) {
      case "lamp":
        mutateLamp({
          name: values.name.trim(),
          autoStatus: isAutoChecked,
          autoFinish: isAutoChecked
            ? dayjs(values.autoFinish).toDate()
            : undefined,
          autoStart: isAutoChecked
            ? dayjs(values.autoStart).toDate()
            : undefined,
          colorId: values.color,
        });
        break;
      case "cleaner":
        mutateCleaner({
          name: values.name.trim(),
          waterCleaning: isWaterCleaning,
          cleaningDuration: dayjs(values.cleaningDuration).minute(),
        });
        break;
      case "socket":
        mutateSocket({
          name: values.name.trim(),
        });
        break;
      default:
        break;
    }
  };

  const onTypeChange = ({ type }: { type: DeviceType }) => {
    if (type) {
      setType(type);
    }
  };

  const isLoading = isLamp && isLoadingColors;

  return (
    <Modal open={open} title="Новое устройство" onCancel={onClose} footer={[]}>
      <Form
        onValuesChange={onTypeChange}
        layout="vertical"
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={{
          autoStatus: false,
          autoStart: dayjs("09:00", "HH:mm"),
          autoFinish: dayjs("23:00", "HH:mm"),
          cleaningDuration: dayjs("05", "m"),
          waterCleaning: false,
          color: colors?.[0]?.id,
        }}
        onFinish={handleSubmit}
      >
        <Form.Item
          rules={[rules.requiredName]}
          name="name"
          label="Название устройства"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[rules.requiredType]}
          label="Тип устройства"
          name="type"
        >
          <Radio.Group value={type}>
            <Radio.Button value="lamp">Лампочка</Radio.Button>
            <Radio.Button value="socket">Розетка</Radio.Button>
            <Radio.Button value="cleaner">Робот-пылесос</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {isLoading && (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        )}
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
              <Checkbox checked={isAutoChecked} onClick={handleAutoClick}>
                Автоматический режим
              </Checkbox>
            </Form.Item>
            {isAutoChecked && (
              <>
                <Form.Item name="autoStart">
                  <TimePicker
                    allowClear={false}
                    placeholder="Начало"
                    format="HH:mm"
                  />
                </Form.Item>
                <Form.Item name="autoFinish">
                  <TimePicker
                    allowClear={false}
                    placeholder="Конец"
                    format="HH:mm"
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
            Создать
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
