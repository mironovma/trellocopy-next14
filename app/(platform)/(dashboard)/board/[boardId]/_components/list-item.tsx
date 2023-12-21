"use client";

import { ElementRef, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { ListWithCard } from "@/types";

import { ListHeader } from "./list-header";
import { CardForm } from "./card-form";
import { CardItem } from "./card-item";

interface ListItemProps {
    data: ListWithCard;
    index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
    const textareaRef = useRef<ElementRef<"textarea">>(null);

    const [isEditing, setIsEditing] = useState(false);

    const disableEditing = () => {
        setIsEditing(false);
    };

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };

    return (
        <li className="shrink-0 h-full w-[272px] select-none">
            <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
                <ListHeader onAddCard={enableEditing} data={data} />
                <ol
                    className={cn(
                        "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                        data.cards.length > 0 ? "mt-2" : "mt-0"
                    )}
                >
                    {data.cards.map((card, index) => (
                        <CardItem key={card.id} index={index} data={card} />
                    ))}
                </ol>
                <CardForm
                    ref={textareaRef}
                    listId={data.id}
                    isEditing={isEditing}
                    enableEditig={enableEditing}
                    disableEditing={disableEditing}
                />
            </div>
        </li>
    );
};
