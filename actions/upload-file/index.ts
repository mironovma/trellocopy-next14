"use server";

import { auth } from "@clerk/nextjs";
import fs from "fs/promises";

/**
 * Идеально сохранять в облако.
 * Так безопаснее и не расходуются лишине ресурсы сервера.
 * Можно сделать клауд на другом сервере и сохранять файлы туда.
 */

// const handler = async (data: InputType): Promise<ReturnType> => {
export const handler = async (data: FormData) => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const file = data.get("attachment") as File;

    if (file.size) {
        const currDate = new Date();
        const date = currDate.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const time = currDate.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        const fileExtension = file.type.split("/").slice(-1)[0];

        const fileName = `${crypto
            .randomUUID()
            .split("-")
            .join("")}_${date.replaceAll(".", "-")}_${time.replaceAll(
            ":",
            "-"
        )}.${fileExtension}`;

        const fileData = await file.arrayBuffer();

        await fs.writeFile(
            `${process.cwd()}/uploadedFiles/${fileName}`,
            Buffer.from(fileData)
        );
    }
};

// export const uploadFile = createSafeAction(UploadFile, handler);
