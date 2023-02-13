import { Lamp } from '@prisma/client'
import prisma from './prisma'
import { UpdatedLamp } from 'types'

// READ
export const getAllLamps = async () => {
  return await prisma.lamp.findMany({})
}

export const getLamp = async (id: string) => {
  return await prisma.lamp.findUnique({
    where: { id }
  })
}

// CREATE
export const createLamp = async (lamp: Omit<Lamp, 'id'>) => {
  return  await prisma.lamp.create({
    data: lamp,
  })
}

// UPDATE
export const updateLamp = async (id: string, lamp: UpdatedLamp) => {
  return await prisma.lamp.update({
    where: {
      id,
    },
    data: lamp,
  })
}

// DELETE
export const deleteLamp = async (id: string) => {
  return await prisma.lamp.delete({
    where: {
      id,
    }
  })
}