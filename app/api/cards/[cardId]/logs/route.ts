import { auth } from "@clerk/nextjs";
import { EntityType } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

/**
 * Теперь можно обращаться к этой api по пути "/api/card/${id}/log"
 */

export async function GET(
    request: Request,
    { params }: { params: { cardId: string } }
) {
    try {
        const { userId, orgId } = auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const auditLogs = await db.auditLog.findMany({
            where: {
                orgId,
                entityId: params.cardId,
                entityType: EntityType.CARD,
            },
            orderBy: {
                createdAt: "desc",
            },
            // Только 3 последних действия будут браться из бд и отображаться
            take: 3,
        });

        return NextResponse.json(auditLogs);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
