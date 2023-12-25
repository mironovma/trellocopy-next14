"use server";

import { auth } from "@clerk/nextjs";
import { Action, EntityType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { CreateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title, image } = data;

    const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
        image.split("|");

    if (
        !imageId ||
        !imageThumbUrl ||
        !imageFullUrl ||
        !imageLinkHTML ||
        !imageUserName
    ) {
        return {
            error: "Missing field. Failed to create board.",
        };
    }

    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,
                imageUserName,
            },
        });

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: EntityType.BOARD,
            action: Action.CREATE,
        });
    } catch (error) {
        return {
            error: "Failed to create",
        };
    }

    revalidatePath(`/board/${board.id}`);
    return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
