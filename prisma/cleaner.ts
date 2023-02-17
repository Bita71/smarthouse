import { VaccumCleaner } from '@prisma/client'
import prisma from './prisma'
import { UpdatedCleaner } from 'types'

const addLog = async (name: string, text: string) =>  await prisma.log.create({
  data: {
    type: 'CLEANER',
    text,
    name,
  },
})

// READ
export const getAllCleaners = async () => {
  return await prisma.vaccumCleaner.findMany({})
}

export const getCleaner = async (id: string) => {
  return await prisma.vaccumCleaner.findUnique({
    where: { id }
  })
}

// CREATE
export const createCleaner = async (cleaner: Omit<VaccumCleaner, 'id'>) => {
  const newClenaer = await prisma.vaccumCleaner.create({
    data: cleaner,
  })
  await addLog(cleaner.name, 'Устройство создано');
  return newClenaer
}

// UPDATE
export const updateCleaner = async (id: string, cleaner: UpdatedCleaner, log: string) => {
  const newCleaner = await prisma.vaccumCleaner.update({
    where: {
      id,
    },
    data: cleaner,
  })

  await addLog(newCleaner.name, log);
  return newCleaner
}

// DELETE
export const deleteCleaner = async (id: string) => {
  const cleaner = await prisma.vaccumCleaner.delete({
    where: {
      id,
    }
  })
  await addLog(cleaner.name, 'Устройство удалено');
  return cleaner
}