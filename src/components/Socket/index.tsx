import { Socket as SocketType } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { FC, useState } from "react";
import { Device } from "../Device";
import styles from "./styles.module.css";
import { UpdateModal } from "../UpdateModal";
import { deleteSocket, updateSocket } from '@/helpers/socket';
import { useStoreon } from "storeon/react";
import { Events, State } from "@/store";

export const Socket: FC<SocketType> = ({
  name,
  id,
  status,
  lastOn,
  lastOff,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { time } = useStoreon<State, Events>("time");
  const queryClient = useQueryClient();

  const { mutate: updateSocketMutate, isLoading: isUpdating } = useMutation({
    mutationFn: updateSocket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sockets"] });
    },
  });

  const { mutate: deleteSocketMutate, isLoading: isDeleting } = useMutation({
    mutationFn: deleteSocket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sockets"] });
    },
  });

  const handleDeleteClick = () => {
    deleteSocketMutate(id);
  };
  const handlePowerClick = () => {
    updateSocketMutate({
      id,
      socket: {
        status: !status,
        lastOn: !status ? time.toDate() : undefined,
        lastOff: status ? time.toDate() : undefined,
      },
      log: 'Устройство ' + (!status ? ' включено' : ' выключено'),
    });
  };
  const handleSettingClick = () => {
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => setIsEditorOpen(false);

  return (
    <Device
      image="/images/socket.png"
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
        type="socket"
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
    </Device>
  );
};
