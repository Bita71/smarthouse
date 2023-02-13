import { Lamp, VaccumCleaner } from "@prisma/client";

type UpdatedLamp = Omit<Partial<Lamp>, 'id'>
type UpdatedCleaner = Omit<Partial<VaccumCleaner>, 'id'>

export type { UpdatedLamp, UpdatedCleaner };
