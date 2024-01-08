"use server";

import fs from "fs/promises";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { Action, EntityType } from "@prisma/client";

import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { DeleteFile } from "./schema";
import { InputType, ReturnType } from "./types";
import { fstat } from "fs";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, cardId, boardId } = data;
    let cardFile;

    try {
        cardFile = await db.cardFile.delete({
            where: {
                id,
                card: {
                    id: cardId,
                },
            },
        });

        await createAuditLog({
            entityId: cardFile.id,
            entityTitle: cardFile.fileName,
            entityType: EntityType.CARD,
            action: Action.UPDATE,
        });

        await fs.unlink(`${process.cwd()}/uploadedFiles/${cardFile.fileName}`);
    } catch (error) {
        return {
            error: "Failed to delete file.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: cardFile };
};

export const deleteCardFile = createSafeAction(DeleteFile, handler);
