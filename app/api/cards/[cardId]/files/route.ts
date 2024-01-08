import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: { cardId: string } }
) {
    try {
        const { userId, orgId } = auth();

        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const cardFiles = await db.cardFile.findMany({
            where: {
                cardId: params.cardId,
            },
            orderBy: {
                uploadedAt: "desc",
            },
        });

        return NextResponse.json(cardFiles);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
