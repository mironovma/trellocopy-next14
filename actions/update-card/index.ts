"use server";

import { auth } from "@clerk/nextjs";
import { Action, EntityType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { UpdateCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId, ...values } = data;
    let card;

    try {
        card = await db.card.update({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
            data: {
                ...values,
            },
        });

        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: EntityType.CARD,
            action: Action.UPDATE,
        });
    } catch (error) {
        return {
            error: "Failed to update",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);
