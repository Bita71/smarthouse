import { getColor } from "@/helpers/color";
import { deleteLamp, updateLamp } from "@/helpers/lamp";
import { Lamp as LampType } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "antd";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { Device } from "../Device";
import styles from "./styles.module.css";
import { UpdateModal } from "../UpdateModal";

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
  const handlePowerClick = () => {
    updateLampMutate({
      id,
      lamp: {
        status: !status,
        lastOn: !status ? dayjs().toDate() : undefined,
        lastOff: status ? dayjs().toDate() : undefined,
      },
    });
  };
  const handleSettingClick = () => {
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => setIsEditorOpen(false);

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
