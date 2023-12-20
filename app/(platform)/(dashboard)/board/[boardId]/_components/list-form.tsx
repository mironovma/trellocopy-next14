"use client";

import { ElementRef, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react";

import { useAction } from "@/hooks/useAction";
import { createList } from "@/actions/create-list";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";

import { ListWrapper } from "./list-wrapper";

export const ListForm = () => {
    const router = useRouter();

    const params = useParams();

    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const { execute, fieldErrors } = useAction(createList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" created!`);
            disableEditing();
            // Чтобы обновить текущий роут и получить новые данные
            router.refresh();
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    /**
     * usehooks-ts
     * Очень крутые type-safe хуки
     *
     * При нажатии на esc отключаем редактирование
     */
    useEventListener("keydown", onKeyDown);
    // Если кликнем снаружи формы, то отключаем редактирование
    useOnClickOutside(formRef, disableEditing);

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        // Из скрытого инупа
        const boardId = formData.get("boardId") as string;

        execute({ title, boardId });
    };

    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    action={onSubmit}
                    ref={formRef}
                    className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
                >
                    <FormInput
                        errors={fieldErrors}
                        ref={inputRef}
                        id="title"
                        placeholder="Enter list title..."
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                    />
                    {/* Чтобы сразу получать и boardId, делаем спрятанные input */}
                    <input hidden value={params.boardId} name="boardId" />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>Add list</FormSubmit>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={disableEditing}
                        >
                            <XIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        );
    }

    return (
        <ListWrapper>
            <button
                onClick={enableEditing}
                className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
            >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add a list
            </button>
        </ListWrapper>
    );
};
