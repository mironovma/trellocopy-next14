"use server";

import { auth } from "@clerk/nextjs";
import { Action, EntityType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { UpdateBoard } from "./schema";
import { InputType, ReturnType } from "./types";

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

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: EntityType.BOARD,
            action: Action.UPDATE,
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
