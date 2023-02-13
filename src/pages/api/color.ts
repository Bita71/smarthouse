import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllColors, getColor } from '../../../prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id && typeof req.query.id === 'string') {
          const color = await getColor(req.query.id)
          return res.status(200).json(color)
        } else {
          const colors = await getAllColors()
          return res.status(200).json(colors)
        }
      }
      default:
        break
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}