"use server";

import { auth } from "@clerk/nextjs";
import { Action, EntityType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { DeleteList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId } = data;
    let list;

    try {
        list = await db.list.delete({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                },
            },
        });

        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: EntityType.LIST,
            action: Action.DELETE,
        });
    } catch (error) {
        return {
            error: "Failed to delete",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);
