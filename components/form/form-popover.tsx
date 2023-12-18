"use client";

import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { XIcon } from "lucide-react";

import { useAction } from "@/hooks/useAction";
import { createBoard } from "@/actions/create-board";

import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { FormInput } from "./form-input";
import { FormSubmit } from "./form-submit";
import { FormPicker } from "./form-picker";

interface FormPopoverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export const FormPopover = ({
    children,
    side = "bottom",
    sideOffset = 0,
    align,
}: FormPopoverProps) => {
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("Board created!");
            /**
             * Создаем реф и вызываем click, чтобы закрыть <PopoverClose>.
             * В <PopoverClose> передаем ref.
             */
            closeRef.current?.click();
            /**
             * Редиректим в новый, только что созданный board (доску с тасками)
             */
            router.push(`/board/${data.id}`);
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;

        execute({ title, image });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent
                align={align}
                side={side}
                sideOffset={sideOffset}
                className="w-80 pt-3"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        variant="ghost"
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                    >
                        <XIcon className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <FormPicker id="image" errors={fieldErrors} />
                        <FormInput
                            id="title"
                            label="Board title"
                            type="text"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className="w-full">Create</FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
};
