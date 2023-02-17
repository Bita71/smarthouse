import { Color, Log } from "@prisma/client";
import { Params } from "prisma";
import { api } from "./api";

interface Response {
  logs?: Log[],
  count?: number,
}

export const getAllLogs = (data: Params = {}) => api.post<Response>('/api/log', data).then((data) => data.data)
