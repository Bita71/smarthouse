import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllLogs } from '../../../prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'POST': {
        const { body } = req
        const logs = await getAllLogs(body)
        return res.status(200).json(logs)
      }
      default:
        break
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}