import prisma from './prisma'
import { UpdatedSocket } from 'types'
import { Socket } from '@prisma/client'

const addLog = async (name: string, text: string) =>  await prisma.log.create({
  data: {
    type: 'SOCKET',
    text,
    name,
  },
})

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
export const createSocket = async (socket: Omit<Socket, 'id'>) => {
  const newSocket = await prisma.socket.create({
    data: socket,
  })
  await addLog(newSocket.name, 'Устройство создано');
  return newSocket
}

// UPDATE
export const updateSocket = async (id: string, socket: UpdatedSocket, log: string) => {
  const newSocket = await prisma.socket.update({
    where: {
      id,
    },
    data: socket,
  })
    await addLog(newSocket.name, log);
  return 
}

// DELETE
export const deleteSocket = async (id: string) => {
  const socket = await prisma.socket.delete({
    where: {
      id,
    }
  })
  await addLog(socket.name, 'Устройство удалено');
  return socket
}