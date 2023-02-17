import type { NextApiRequest, NextApiResponse } from 'next'
import { createSocket, deleteSocket, getAllSockets, getSocket, updateSocket } from '../../../prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.query.id && typeof req.query.id === 'string') {
          const socket = await getSocket(req.query.id)
          return res.status(200).json(socket)
        } else {
          const sockets = await getAllSockets()
          return res.status(200).json(sockets)
        }
      }
      case 'POST': {
        const { socket } = req.body
        const newsocket = await createSocket(socket)
        return res.status(200).json(newsocket)
      }
      case 'PUT': {
        const {
          id,
          socket,
          log,
        } = req.body
        const newsocket = await updateSocket(id, socket, log)
        return res.status(200).json(newsocket)
      }
      case 'DELETE': {
        const { id } = req.body
        const socket = await deleteSocket(id)
        return res.status(200).json(socket)
      }
      default:
        break
    }
  } catch (error: any) {
    return res.status(500).json({ ...error, message: error.message })
  }
}