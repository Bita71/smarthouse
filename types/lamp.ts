import { Lamp, Socket, VaccumCleaner } from "@prisma/client";

type UpdatedLamp = Omit<Partial<Lamp>, 'id'>
type UpdatedCleaner = Omit<Partial<VaccumCleaner>, 'id'>
type UpdatedSocket = Omit<Partial<Socket>, 'id'>

export type { UpdatedLamp, UpdatedCleaner, UpdatedSocket };
