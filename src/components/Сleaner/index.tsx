import { VaccumCleaner } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { FC, useCallback, useEffect, useState } from "react";
import { Device } from "../Device";
import styles from "./styles.module.css";
import { UpdateModal } from "../UpdateModal";
import { deleteCleaner, updateCleaner } from "@/helpers/cleaner";
import { BgColorsOutlined, ClearOutlined } from "@ant-design/icons";

export const Cleaner: FC<VaccumCleaner> = ({
  name,
  id,
  status,
  cleaningDuration,
  lastCleaning,
  startCleaning,
  waterCleaning,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: updateCleanerMutate, isLoading: isUpdating } = useMutation({
    mutationFn: updateCleaner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaners"] });
    },
  });

  const { mutate: deleteCleanerMutate, isLoading: isDeleting } = useMutation({
    mutationFn: deleteCleaner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cleaners"] });
    },
  });

  const handleDeleteClick = () => {
    deleteCleanerMutate(id);
  };
  const handlePowerClick = useCallback(() => {
    updateCleanerMutate({
      id,
      cleaner: {
        status: !status,
        startCleaning: !status ? dayjs().toDate() : undefined,
        lastCleaning: status ? dayjs().toDate() : undefined,
      },
    });
  }, [id, status, updateCleanerMutate]);
  const handleSettingClick = () => {
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => setIsEditorOpen(false);

  const cleaningFinish = dayjs(startCleaning).add(cleaningDuration, "minute");
  const isOff = dayjs().isAfter(cleaningFinish);

  useEffect(() => {
    if (!isUpdating && status && isOff) {
      handlePowerClick();
    }
  }, [handlePowerClick, isOff, isUpdating, status]);

  return (
    <Device
      image="/images/cleaner.webp"
      name={
        <div className={styles.title}>
          {name}
          {status && <ClearOutlined className={styles.cleaning} />}
          {status && waterCleaning && (
            <BgColorsOutlined className={styles.watering} />
          )}
        </div>
      }
      on={status}
      onDeleteClick={handleDeleteClick}
      onPowerClick={handlePowerClick}
      onSettingClick={handleSettingClick}
      isPowering={isUpdating}
      isDeleting={isDeleting}
    >
      <UpdateModal
        id={id}
        type="cleaner"
        open={isEditorOpen}
        onClose={handleEditorClose}
      />
      {status && startCleaning && (
        <div className={styles.content}>
          Уборка начата в {dayjs(startCleaning).format("HH:mm")}
          <br />
          Уборка закончиться в {cleaningFinish.format("HH:mm")}
        </div>
      )}
      {!status && lastCleaning && (
        <div className={styles.content}>
          Последняя уборка была {dayjs(lastCleaning).format("D.MM.YYYY")} в{" "}
          {dayjs(lastCleaning).format("HH:mm")}{" "}
        </div>
      )}
      {!startCleaning && !lastCleaning && (
        <div className={styles.content}>Ещё не было ни одной уборки</div>
      )}
    </Device>
  );
};
