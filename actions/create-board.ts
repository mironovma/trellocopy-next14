"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/lib/db";

/**
 * Функция запустится на сервере
 * Это server actions
 */

/**
 * npx prisma studio
 * Открывает интерфейс, в котором удобно можем видеть
 * нашу БД и все наши модели.
 */

/**
 * Для валидации формы используем zod
 * Подробнее:
 * https://zod.dev/
 */

// Инициализируем стейт для ошибок (для формы валидации)
export type State = {
    errors?: {
        title?: string[];
    };
    message?: string | null;
};

// Инициализируем форму валидации
const CreateBoard = z.object({
    // Указываем, что title может быть только строкой и мин. длина строки должна быть больше 3
    title: z
        .string()
        .min(3, { message: "Minimum length of 3 letters is required" }),
});

export async function create(prevState: State, formData: FormData) {
    // Получаем поле title
    // const title = formData.get("title") as string;
    // Теперь получаем поле title, предварительно валидируя через zod
    const validatedFields = CreateBoard.safeParse({
        title: formData.get("title"),
    });

    // Если валидация прошла НЕ успешно, то возвращаем объект с ошибками и сообщение об ошибке валидации
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields",
        };
    }

    // Поле title получаем из validatedFields.data после всех проверок на валидацию
    const { title } = validatedFields.data;

    // С помощью prisma кидаем новые данные в БД
    // Чтобы привентировать возможные ошибки, оборачиваем в try...catch
    try {
        await db.board.create({
            data: {
                title,
            },
        });
    } catch (error) {
        return {
            message: "Database Error",
        };
    }

    /**
     * Позволяет очищать кэш в серверных компонентах, что
     * позволяет без обновления страницы получать новые данные в моменте.
     */
    revalidatePath("/organization/org_2ZDBFIW6m2V6foBLz73cYexgipX");
    redirect("/organization/org_2ZDBFIW6m2V6foBLz73cYexgipX");
}
