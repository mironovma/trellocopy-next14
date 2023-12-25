"use server";

import { auth } from "@clerk/nextjs";
import { Action, EntityType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { CreateCard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title, boardId, listId } = data;
    let card;

    try {
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId,
                },
            },
        });

        if (!list) {
            return {
                error: "List not found",
            };
        }

        const lastCard = await db.card.findFirst({
            where: { listId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data: {
                title,
                listId,
                order: newOrder,
            },
        });

        // Create audit log (activity)
        await createAuditLog({
            entityId: card.id,
            entityTitle: card.title,
            entityType: EntityType.CARD,
            action: Action.CREATE,
        });
    } catch (error) {
        return {
            error: "Failed to create list.",
        };
    }

    revalidatePath(`/board/${boardId}`);
    return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);
