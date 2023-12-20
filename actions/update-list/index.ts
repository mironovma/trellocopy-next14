"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { UpdateList } from "./schema";

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
    } catch (error) {
        return {
            error: "Failed to update.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);
