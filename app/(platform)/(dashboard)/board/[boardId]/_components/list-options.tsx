"use client";

import { ElementRef, useRef } from "react";
import { List } from "@prisma/client";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { useAction } from "@/hooks/useAction";
import { deleteList } from "@/actions/delete-list";
import { copyList } from "@/actions/copy-list";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";

interface ListOptionsProps {
    data: List;
    onAddCard: () => void;
}

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
    const closeRef = useRef<ElementRef<"button">>(null);

    const { execute: executeDelete } = useAction(deleteList, {
        onSuccess: (data) => {
            toast.success(`List ${data.title} deleted!`);
            // Клик на PopoverClose для закрытия после удаления + далее после копирования
            closeRef.current?.click();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeCopy } = useAction(copyList, {
        onSuccess: (data) => {
            toast.success(`List ${data.title} copied.`);
            closeRef.current?.click();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onDelete = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        executeDelete({ id, boardId });
    };

    const onCopy = (formData: FormData) => {
        const id = formData.get("id") as string;
        const boardId = formData.get("boardId") as string;

        executeCopy({ id, boardId });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="h-auto w-auto p-2" variant="ghost">
                    <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="px-0 pt-3 pb-3"
                side="bottom"
                align="start"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    List actions
                </div>
                <PopoverClose asChild ref={closeRef}>
                    <Button
                        variant="ghost"
                        className="h-auto w-auto absolute top-2 right-2 text-neutral-600"
                    >
                        <XIcon className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <Button
                    variant="ghost"
                    onClick={onAddCard}
                    className="rounded-none w-full h-auto px-5 py-2 justify-start font-normal text-sm"
                >
                    Add card
                </Button>
                <form action={onCopy}>
                    <input hidden name="id" id="id" value={data.id} />
                    <input
                        hidden
                        name="boardId"
                        id="boardId"
                        value={data.boardId}
                    />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto px-5 py-2 justify-start font-normal text-sm"
                    >
                        Copy list
                    </FormSubmit>
                </form>
                <Separator />
                <form action={onDelete}>
                    <input hidden name="id" id="id" value={data.id} />
                    <input
                        hidden
                        name="boardId"
                        id="boardId"
                        value={data.boardId}
                    />
                    <FormSubmit
                        variant="ghost"
                        className="rounded-none w-full h-auto px-5 py-2 justify-start font-normal text-sm"
                    >
                        Delete this list
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
};
