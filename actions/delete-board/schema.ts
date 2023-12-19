import { z } from "zod";

export const DeleteBoard = z.object({
    // Ссылкаем на конкретный board, который пользователь удаляет
    id: z.string(),
});
