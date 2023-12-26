"use client";

import { FileIcon, FileInputIcon } from "lucide-react";
import { ElementRef, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const UploadForm = () => {
    const inputRef = useRef<ElementRef<"input">>(null);

    const [isEditing, setIsEditing] = useState(false);

    const enableEditig = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.click();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    return (
        <div className="flex items-start gap-x-3 w-full">
            <FileIcon className="w-5 h-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Uploaded Files
                </p>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={enableEditig}
                    className="h-8 w-auto flex justify-start items-center font-medium py-3 px-3.5 rounded-md text-sm"
                >
                    <div className="flex gap-x-1">
                        <FileInputIcon className="w-4 h-4 text-white" /> Upload
                        files
                    </div>
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    hidden
                    id="file"
                    name="file"
                />
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
