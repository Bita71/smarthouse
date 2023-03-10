import cx from 'classnames';
import { getColor } from "@/helpers/color";
import { deleteLamp, updateLamp } from "@/helpers/lamp";
import { Lamp as LampType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import { FC, useCallback, useEffect, useState } from "react";
import { Device } from "../Device";
import styles from "./styles.module.css";
import { UpdateModal } from "../UpdateModal";
import { useStoreon } from 'storeon/react';
import { Events, State } from '@/store';

export const Lamp: FC<LampType> = ({
  name,
  id,
  status,
  lastOn,
  lastOff,
  colorId,
  autoStatus,
  autoStart,
  autoFinish,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { time } = useStoreon<State, Events>("time");
  const queryClient = useQueryClient();

  const { data: color, isLoading: isColorLoading } = useQuery({
    queryKey: ["color", colorId],
    queryFn: () => getColor(colorId),
  });

  const { mutate: updateLampMutate, isLoading: isUpdating } = useMutation({
    mutationFn: updateLamp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lamps"] });
    },
  });

  const { mutate: deleteLampMutate, isLoading: isDeleting } = useMutation({
    mutationFn: deleteLamp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lamps"] });
    },
  });

  const handleDeleteClick = () => {
    deleteLampMutate(id);
  };
  const handlePowerClick = useCallback(() => {
    updateLampMutate({
      id,
      lamp: {
        status: !status,
        lastOn: !status ? time.toDate() : undefined,
        lastOff: status ? time.toDate() : undefined,
      },
      log: 'Устройство ' + (!status ? ' включено' : ' выключено'),
    });
  }, [id, status, time, updateLampMutate]);
  const handleSettingClick = () => {
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => setIsEditorOpen(false);


  useEffect(() => {
    if (!autoStatus || isUpdating || !autoStart || !autoFinish) {
      return;
    }

    const startHour = dayjs(autoStart).hour();
    const startMinute = dayjs(autoStart).minute();
    const start = dayjs().startOf('day').add(startHour, 'hour').add(startMinute, 'minute');
    const finishHour = dayjs(autoFinish).hour();
    const finishMinute = dayjs(autoFinish).minute();
    const finish = dayjs().startOf('day').add(finishHour, 'hour').add(finishMinute, 'minute');

    if (!status && time.isAfter(start) && time.isBefore(finish)) {
      handlePowerClick()
    }

    if (status && (time.isBefore(start) || time.isAfter(finish))) {
      handlePowerClick()
    }
  }, [autoFinish, autoStart, autoStatus, handlePowerClick, isUpdating, status, time]);

  return (
    <Device
      image="/images/lamp.webp"
      name={name}
      on={status}
      onDeleteClick={handleDeleteClick}
      onPowerClick={handlePowerClick}
      onSettingClick={handleSettingClick}
      isPowering={isUpdating}
      isDeleting={isDeleting}
    >
      <div className={cx(styles.backlight, { [styles.on]: status })} style={{ backgroundColor: color?.hex }} />
      <UpdateModal
        id={id}
        type="lamp"
        open={isEditorOpen}
        onClose={handleEditorClose}
      />
      {status && lastOn && (
        <div className={styles.content}>
          Включили {dayjs(lastOn).format("D.MM.YYYY")} в{" "}
          {dayjs(lastOn).format("HH:mm")}{" "}
        </div>
      )}
      {!status && lastOff && (
        <div className={styles.content}>
          Выключили {dayjs(lastOff).format("D.MM.YYYY")} в{" "}
          {dayjs(lastOff).format("HH:mm")}{" "}
        </div>
      )}
      {!lastOn && !lastOff && (
        <div className={styles.content}>Никогда не включали</div>
      )}
      <div className={styles.color}>
        Цвет:{" "}
        {isColorLoading ? (
          <Skeleton.Input active size="small" />
        ) : (
          <span style={{ color: color?.hex }}>{color?.name}</span>
        )}
      </div>
      {autoStatus && (
        <div className={styles.content}>
          Режим: {dayjs(autoStart).format("HH:mm")}-
          {dayjs(autoFinish).format("HH:mm")}
        </div>
      )}
    </Device>
  );
};
