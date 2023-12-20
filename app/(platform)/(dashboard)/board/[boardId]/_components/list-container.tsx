"use client";

import { ListWithCard } from "@/types";

import { ListForm } from "./list-form";

interface ListContainerProps {
    data: ListWithCard;
    boardId: string;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
    return <ol>
        <ListForm />
        <div className="flex-shrink-0 w-1" />
    </ol>;
};
