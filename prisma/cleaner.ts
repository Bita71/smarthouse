import { VaccumCleaner } from '@prisma/client'
import prisma from './prisma'
import { UpdatedCleaner } from 'types'

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
  return  await prisma.vaccumCleaner.create({
    data: cleaner,
  })
}

// UPDATE
export const updateCleaner = async (id: string, cleaner: UpdatedCleaner) => {
  return await prisma.vaccumCleaner.update({
    where: {
      id,
    },
    data: cleaner,
  })
}

// DELETE
export const deleteCleaner = async (id: string) => {
  return await prisma.vaccumCleaner.delete({
    where: {
      id,
    }
  })
}