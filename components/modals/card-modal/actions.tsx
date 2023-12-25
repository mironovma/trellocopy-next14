"use client";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import { CopyIcon, TrashIcon } from "lucide-react";

import { useAction } from "@/hooks/useAction";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";

import { useCardModal } from "@/hooks/useCardModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";

interface ActionsProps {
    data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
    const params = useParams();

    const cardModal = useCardModal();

    const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
        copyCard,
        {
            onSuccess: (data) => {
                toast.success(`Card "${data.title} copied!"`);
                cardModal.onClose();
            },
            onError: (error) => {
                toast.error(error);
            },
        }
    );

    const { execute: executeDeleteCard, isLoading: isLoadingDelete } =
        useAction(deleteCard, {
            onSuccess: (data) => {
                toast.success(`Card "${data.title} deleted!"`);
                cardModal.onClose();
            },
            onError: (error) => {
                toast.error(error);
            },
        });

    const onCopy = () => {
        const boardId = params.boardId as string;

        executeCopyCard({
            id: data.id,
            boardId,
        });
    };

    const onDelete = () => {
        const boardId = params.boardId as string;

        executeDeleteCard({
            id: data.id,
            boardId,
        });
    };

    return (
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold">Actions</p>
            <Button
                variant="gray"
                size="inline"
                className="w-full justify-start"
                disabled={isLoadingCopy}
                onClick={onCopy}
            >
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy
            </Button>
            <Button
                variant="gray"
                size="inline"
                className="w-full justify-start"
                disabled={isLoadingDelete}
                onClick={onDelete}
            >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
            </Button>
        </div>
    );
};

Actions.Skeleton = function ActionsSkeleton() {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
        </div>
    );
};
