import { Socket } from '@prisma/client';
import { UpdatedSocket } from 'types';
import { api } from "./api";

interface UpdateSocketProps {
  id: string,
  socket: UpdatedSocket
}

interface CreateSocketProps extends Partial<Omit<Socket, 'id'>> {
  name: string,
}

export const getAllSockets = () => api.get<Socket[]>('/api/socket').then((data) => data.data)
export const getSocket = (id: string) => api.get<Socket>(`/api/socket/?id=${id}`).then((data) => data.data)

export const createSocket = (socket: CreateSocketProps) => api.post<Socket>('/api/socket', {
  socket,
}).then((data) => data.data)

export const updateSocket = ({ id, socket }: UpdateSocketProps) => api.put<Socket>('/api/socket', {
  id,
  socket,
}).then((data) => data.data)

export const deleteSocket = (id: string) => api.delete<Socket>('/api/socket', {
  data: {id}
}).then((data) => data.data)