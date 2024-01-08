"use client";

import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { FileIcon, FileInputIcon, FilesIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { uploadFileDirectly } from "@/actions/upload-file";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardFile } from "@prisma/client";
import { useAction } from "@/hooks/useAction";
import { deleteCardFile } from "@/actions/delete-file";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";

interface UploadFormProps {
    cardId?: string;
    files?: CardFile[];
}

/**
 * TODO:
 * Uncaught Error: Only plain objects, and a few built-ins,
 * can be passed to Server Actions. Classes or null prototypes
 * are not supported.
 *
 * На server action с useAction. Поэтому используем без.
 *
 * Просто отправить файл, как FormData могу, но через useActions не дает.
 */

export const UploadForm = ({ cardId, files }: UploadFormProps) => {
    const params = useParams();

    const [isUploading, setIsUploading] = useState(false);

    const fileRef = useRef<ElementRef<"input">>(null);

    const onSelectFile = () => {
        fileRef.current?.click();
        setIsUploading(true);
    };

    // const { execute } = useAction(uploadFile, {
    //     onSuccess: (data) => {
    //         toast.success(`File ${data.fileName} is uploaded!`);
    //         setIsUploading(false);
    //     },
    //     onError: (error) => {
    //         toast.error(error);
    //     },
    // });

    const { execute: executeDeleteCardFile, isLoading: isLoadingDelete } =
        useAction(deleteCardFile, {
            onSuccess: (data) => {
                toast.success(`File "${data.fileName} deleted!"`);
            },
            onError: (error) => {
                toast.error(error);
            },
        });

    const onSubmit = (formData: FormData) => {
        const cardId = formData.get("cardId") as string;

        uploadFileDirectly(formData, cardId, params.boardId as string);

        setIsUploading(false);
    };

    const { data: cardFilesData } = useQuery<CardFile[]>({
        queryKey: ["card-files", cardId],
        queryFn: () => fetcher(`/api/cards/${cardId}/files`),
    });

    const onDelete = () => {
        const boardId = params.boardId as string;
        const cardID = cardId as string;
        const fileId = cardFilesData?.[0].id as string;

        executeDeleteCardFile({
            boardId,
            cardId: cardID,
            id: fileId,
        });
    };

    return (
        <div className="flex items-start gap-x-3 w-full">
            <FileIcon className="w-5 h-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Uploaded Files
                </p>

                {!!!files?.length && (
                    <form action={onSubmit}>
                        <Button
                            type="button"
                            onClick={onSelectFile}
                            variant="secondary"
                            size="sm"
                            className="h-8 w-auto flex justify-start font-medium py-3 px-3.5 rounded-md text-sm mb-3"
                        >
                            <div className="flex gap-x-1 items-center">
                                <FileInputIcon className="w-4 h-4" /> Upload
                                files
                            </div>
                        </Button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept=".pdf, .xls, .xlsx, .doc, .docx"
                            id="attachment"
                            name="attachment"
                            hidden
                        />
                        <input hidden value={cardId} name="cardId" />
                        {isUploading && (
                            <Button
                                type="submit"
                                variant="primary"
                                className="mb-3"
                            >
                                Upload
                            </Button>
                        )}
                    </form>
                )}

                {/* Будет блочить скачивание файла сам браузер, т.к. файл хранится локально.
                Как ранее и писал, для сохранения файла нужно использовать готовое клауд решение
                либо делать под клауд сервер, где будут валидироваться и сканироваться все загружаемые файлы.
                Если все-таки хочется скачать загруженный фалй, то нужно в настройках хрома (Приватносить и безопасность),
                перейти в Security и в Safe Browsing нажать No protection  */}
                <div className="flex flex-col gap-1">
                    {files &&
                        files.map((file) => (
                            <li
                                className="list-none cursor-pointer"
                                key={file.id}
                            >
                                <div className="flex items-center gap-x-1">
                                    <FilesIcon className="w-4 h-4" />
                                    <a
                                        className="text-primary text-sm hover:underline hover:text-sky-700/90"
                                        href={file.path}
                                    >
                                        {file.fileName}
                                    </a>
                                    <Button
                                        variant="ghost"
                                        size="inline"
                                        disabled={isLoadingDelete}
                                        onClick={onDelete}
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                </div>
            </div>
        </div>
    );
};

UploadForm.Skeleton = function UploadFormSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="w-28 h-6 mb-2 bg-neutral-200" />
                <div className="flex items-start gap-x-3 w-full mb-2">
                    <Skeleton className="h-6 w-6 bg-neutral-200" />
                    <Skeleton className="h-6 w-24 bg-neutral-200" />
                </div>
                <div className="flex items-start gap-x-3 w-full mb-2">
                    <Skeleton className="h-6 w-6 bg-neutral-200" />
                    <Skeleton className="h-6 w-28 bg-neutral-200" />
                </div>
                <div className="flex items-start gap-x-3 w-full mb-2">
                    <Skeleton className="h-6 w-6 bg-neutral-200" />
                    <Skeleton className="h-6 w-24 bg-neutral-200" />
                </div>
            </div>
        </div>
    );
};
