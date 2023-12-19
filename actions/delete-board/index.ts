"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { InputType, ReturnType } from "./types";
import { DeleteBoard } from "./schema";

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
    } catch (error) {
        return {
            error: "Failed to delete",
        };
    }

    revalidatePath(`/organization/${orgId}`);
    redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
