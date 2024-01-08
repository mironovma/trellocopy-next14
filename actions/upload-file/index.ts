"use server";

import fs from "fs/promises";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { UploadFile } from "./schema";
import { Action, EntityType } from "@prisma/client";

/**
 * Идеально сохранять в облако.
 * Так безопаснее и не расходуются лишине ресурсы сервера.
 * Можно сделать клауд на другом сервере и сохранять файлы туда.
 */

// const handler = async (data: InputType): Promise<ReturnType> => {
//     /**
//      * Авторизован ли пользователь и привязан ли он к организации
//      */
//     const { userId, orgId } = auth();

//     if (!userId || !orgId) {
//         return {
//             error: "Unauthorized",
//         };
//     }

//     /**
//      * Получаем только cardId, т.к. fileName и path будем получать прямо здесь
//      * (имя генерируем здесь, путь указываем здесь)
//      */
//     const { cardId, file } = data;
//     let fileData;

//     if (!file.size) {
//         return {
//             error: "Failed to upload file (size)",
//         };
//     }

//     /**
//      * Будем генерировать новое имя файла в формате: хэш_дата_время
//      * Можно было бы грузить имя файла как есть и прибавлять Date.now, но, т.к.
//      * сервер не настроен на кодировку UTF-8, то при загрузке на сервер, имя файла превращается
//      * в иероглифы.
//      */
//     const currDate = new Date();
//     const date = currDate
//         .toLocaleDateString("ru-RU", {
//             day: "2-digit",
//             month: "2-digit",
//             year: "numeric",
//         })
//         .replaceAll(".", "-");
//     const time = currDate
//         .toLocaleTimeString("ru-RU", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: false,
//         })
//         .replaceAll(":", "-");

//     // Берем type и сплиттим его, а не name, т.к. в названии еще могут быть точки
//     const fileExtension = file.type.split("/").slice(-1)[0];

//     // Теперь задаем имя файла, как выше и писали
//     const fileName = `${crypto
//         .randomUUID()
//         .split("-")
//         .join("")}_${date}_${time}.${fileExtension}`;

//     /**
//      * Записываем файл в буфер для хранение двоичных данных в памяти,
//      * получаем содержимое файла и сохраняем локально в корне (uploadedFiles)
//      */
//     const fileBuffer = await file.arrayBuffer();
//     await fs.writeFile(
//         `${process.cwd()}/uploadedFiles/${fileName}`,
//         Buffer.from(fileBuffer)
//     );

//     try {
//         const card = await db.card.findUnique({
//             where: {
//                 id: cardId,
//             },
//         });

//         if (!card) {
//             return {
//                 error: "Card not found",
//             };
//         }

//         fileData = await db.cardFile.create({
//             data: {
//                 fileName,
//                 path: `${process.cwd()}/uploadedFiles/${fileName}`,
//                 cardId: card.id,
//             },
//         });
//          // Делаем запись в Activity
//          await createAuditLog({
//              entityId: card.id,
//              entityTitle: card.title,
//              entityType: EntityType.CARD,
//              action: Action.UPDATE,
//          });
//     } catch (error) {
//         return {
//             error: "Filed to upload file",
//         };
//     }

//     // Сделать ревалидацию, чтобы сервер обновил кеш и было видно сразу загруженный файл без хард релоуда вручную
//     // revalidatePath(`/board/${}`)
//     revalidatePath(`/board/`);
//     return { data: fileData };
// };

// export const uploadFile = createSafeAction(UploadFile, handler);

/**
 * TODO:
 * Uncaught Error: Only plain objects, and a few built-ins,
 * can be passed to Server Actions. Classes or null prototypes
 * are not supported.
 *
 * На server action с useAction. Поэтому используем без.
 *
 * Просто отправить файл, как FormData могу, но через useActions не дает.
 */

interface uploadFileProps {
    data: FormData;
    cardId: string;
}

// export const uploadFileDirectly = async ({ data, cardId }: uploadFileProps) => {
export const uploadFileDirectly = async (
    data: FormData,
    cardId: string,
    boardId: string
) => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const file = data.get("attachment") as File;

    if (!file.size) {
        console.log("Failed to upload file (size)");
        return {
            error: "Failed to upload file (size)",
        };
    }

    const currDate = new Date();
    const date = currDate
        .toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        .replaceAll(".", "-");
    const time = currDate
        .toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
        .replaceAll(":", "-");

    const fileExtension = file.type.split("/").slice(-1)[0];

    const fileName = `${crypto
        .randomUUID()
        .split("-")
        .join("")}_${date}_${time}.${fileExtension}`;

    const fileBuffer = await file.arrayBuffer();
    await fs.writeFile(
        `${process.cwd()}/uploadedFiles/${fileName}`,
        Buffer.from(fileBuffer)
    );

    try {
        const card = await db.card.findUnique({
            where: {
                id: cardId,
            },
        });

        if (!card) {
            console.log("Card not found");
            return {
                error: "Card not found",
            };
        }

        await db.cardFile.create({
            data: {
                fileName,
                path: `${process.cwd()}/uploadedFiles/${fileName}`,
                cardId: card.id,
            },
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: EntityType.CARD,
            action: Action.UPDATE,
        });
    } catch (error) {
        console.log(error);
        return {
            error: "Filed to upload file",
        };
    }

    revalidatePath(`/board/${boardId}`);
};
