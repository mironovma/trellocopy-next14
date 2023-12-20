import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
    params: {
        boardId: string;
    };
}

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    }

    const lists = await db.list.findMany({
        where: {
            // Ищем по связанности с boardId
            boardId: params.boardId,
            // И по orgId
            board: {
                orgId,
            },
        },
        // Включая карточки, которые сортируем по возрастанию
        include: {
            cards: {
                orderBy: {
                    // position
                    order: "asc",
                },
            },
        },
        orderBy: {
            order: "asc",
        },
    });

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer boardId={params.boardId} data={lists} />
        </div>
    );
};

export default BoardIdPage;
