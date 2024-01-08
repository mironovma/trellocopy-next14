import { z } from "zod";

export const UploadFile = z.object({
    cardId: z.string(),
    file: z.instanceof(File),
});
