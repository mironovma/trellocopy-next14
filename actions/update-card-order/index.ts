"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { UpdateCardOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { items, boardId } = data;
    let updatedCards;

    try {
        const transacttion = items.map((card) =>
            db.card.update({
                where: {
                    id: card.id,
                    list: {
                        board: {
                            orgId,
                        },
                    },
                },
                data: {
                    order: card.order,
                    listId: card.listId,
                },
            })
        );

        updatedCards = await db.$transaction(transacttion);
    } catch (error) {
        return {
            error: "Failed to reorder.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: updatedCards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
