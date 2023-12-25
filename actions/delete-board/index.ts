"use server";

import { auth } from "@clerk/nextjs";
import { Action, EntityType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";

import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id } = data;
    let board;

    try {
        board = await db.board.delete({
            // Какой удаляем?
            where: {
                id,
                /**
                 * Передаем сюда еще orgId, чтобы убедиться, что
                 * у пользователя есть права удалять конкретный board, т.е.
                 * ищем board по id и сопоставляем принадлежность пользователя к
                 * организации, у которой есть этот board по orgId.
                 */
                orgId,
            },
        });

        await createAuditLog({
            entityId: board.id,
            entityTitle: board.title,
            entityType: EntityType.BOARD,
            action: Action.DELETE,
        });
    } catch (error) {
        return {
            error: "Failed to delete",
        };
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
