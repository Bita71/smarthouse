import prisma from './prisma'

// READ
export const getAllColors = async () => {
  return await prisma.color.findMany({})
}

export const getColor = async (id: string) => {
  return await prisma.color.findUnique({
    where: { id }
  })
}