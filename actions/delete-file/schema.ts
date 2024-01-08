import { z } from "zod";

export const DeleteFile = z.object({
    id: z.string(),
    cardId: z.string(),
    boardId: z.string(),
});
