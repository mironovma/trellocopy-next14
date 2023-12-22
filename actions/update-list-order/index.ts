"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { UpdateListOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { boardId, items } = data;
    let lists;

    try {
        const transacttion = items.map((list) =>
            // instant return
            db.list.update({
                where: {
                    id: list.id,
                    board: {
                        orgId,
                    },
                },
                data: {
                    order: list.order,
                },
            })
        );

        lists = await db.$transaction(transacttion);
    } catch (error) {
        return {
            error: "Failed to reorder.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
