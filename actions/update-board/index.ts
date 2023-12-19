"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { UpdateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, title } = data;
    let board;

    try {
        board = await db.board.update({
            // Где обновляем
            where: {
                id,
                orgId,
            },
            // Данные, которые обновляем/передаем
            data: {
                title,
            },
        });
    } catch (error) {
        return {
            error: "Failed to update",
        };
    }

    revalidatePath(`/board/${id}`);

    return { data: board };
};

export const updateBoard = createSafeAction(UpdateBoard, handler);
