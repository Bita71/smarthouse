import type { NextApiRequest, NextApiResponse } from 'next'
import { createCleaner, deleteCleaner, getAllCleaners, getCleaner, updateCleaner } from '../../../prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id && typeof req.query.id === 'string') {
          const result = await getCleaner(req.query.id)
          return res.status(200).json(result)
        } else {
          const result = await getAllCleaners()
          return res.status(200).json(result)
        }
      }
      case 'POST': {
        const { cleaner } = req.body
        const result = await createCleaner(cleaner)
        return res.status(200).json(result)
      }
      case 'PUT': {
        const {
          id,
          cleaner
        } = req.body
        const result = await updateCleaner(id, cleaner)
        return res.status(200).json(result)
      }
      case 'DELETE': {
        const { id } = req.body
        const result = await deleteCleaner(id)
        return res.status(200).json(result)
      }
      default:
        break
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}