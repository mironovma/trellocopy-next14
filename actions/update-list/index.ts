"use server";

import { auth } from "@clerk/nextjs";
import { Action, EntityType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { UpdateList } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, title, boardId } = data;
    let list;

    try {
        list = await db.list.update({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                },
            },
            data: {
                title,
            },
        });

        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: EntityType.LIST,
            action: Action.UPDATE,
        });
    } catch (error) {
        return {
            error: "Failed to update.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);
