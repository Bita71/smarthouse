import { Color } from "@prisma/client";
import { api } from "./api";

export const getAllColors = () => api.get<Color[]>('/api/color').then((data) => data.data)
export const getColor = (id: string) => api.get<Color>(`/api/color/?id=${id}`).then((data) => data.data)
