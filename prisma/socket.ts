import prisma from './prisma'
import { UpdatedSocket } from 'types'
import { Socket } from '@prisma/client'

// READ
export const getAllSockets = async () => {
  return await prisma.socket.findMany({})
}

export const getSocket = async (id: string) => {
  return await prisma.socket.findUnique({
    where: { id }
  })
}

// CREATE
export const createSocket = async (lamp: Omit<Socket, 'id'>) => {
  return  await prisma.socket.create({
    data: lamp,
  })
}

// UPDATE
export const updateSocket = async (id: string, socket: UpdatedSocket) => {
  return await prisma.socket.update({
    where: {
      id,
    },
    data: socket,
  })
}

// DELETE
export const deleteSocket = async (id: string) => {
  return await prisma.socket.delete({
    where: {
      id,
    }
  })
}