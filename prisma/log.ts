import { LogType } from '@prisma/client'
import prisma from './prisma'

export interface Params {
  type?: LogType,
  startDate?: Date,
  endDate?: Date,
  skip?: number,
}

// READ
export const getAllLogs = async ({ type, startDate, endDate, skip = 0 }: Params = {}) => {
  const logs = await prisma.log.findMany({
    where: {
      type,
      time: { gte: startDate, lte: endDate }
    },
    orderBy: {
      time: 'desc',
    },
    take: 5,
    skip,
  })

  const count = await prisma.log.count({
    where: {
      type,
      time: { gte: startDate, lte: endDate }
    },
    orderBy: {
      time: 'desc',
    },
  })

  return { logs, count }
}


