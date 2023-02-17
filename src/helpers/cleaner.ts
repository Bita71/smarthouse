import { VaccumCleaner } from '@prisma/client';
import { UpdatedCleaner } from 'types';
import { api } from "./api";

interface UpdateCleanerProps {
  id: string,
  cleaner: UpdatedCleaner
  log?: string,
}

interface CreateCleanerProps extends UpdatedCleaner {
  name: string,
}

export const getAllCleaners = () => api.get<VaccumCleaner[]>('/api/cleaner').then((data) => data.data)
export const getCleaner = (id: string) => api.get<VaccumCleaner>(`/api/cleaner/?id=${id}`).then((data) => data.data)

export const createCleaner = (cleaner: CreateCleanerProps) => api.post<VaccumCleaner>('/api/cleaner', {
  cleaner,
}).then((data) => data.data)

export const updateCleaner = ({ id, cleaner, log }: UpdateCleanerProps) => api.put<VaccumCleaner>('/api/cleaner', {
  id,
  cleaner,
  log,
}).then((data) => data.data)

export const deleteCleaner = (id: string) => api.delete<VaccumCleaner>('/api/cleaner', {
  data: {id}
}).then((data) => data.data)