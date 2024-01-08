import { z } from "zod";

export const UploadFile = z.object({
    id: z.string(),
    file: z.instanceof(File),
    cardId: z.string(),
});
