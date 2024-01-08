"use client";

import { FileIcon, FileInputIcon } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

import { handler } from "@/actions/upload-file";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const UploadForm = () => {
    const [isUploading, setIsUploading] = useState(false);

    const fileRef = useRef<ElementRef<"input">>(null);

    const onSelectFile = () => {
        fileRef.current?.click();
        setIsUploading(true);
    };

    const onSubmit2 = (formData: FormData) => {
        toast.success("File uploaded!");
        // const file = formData.get("attachment") as File;

        handler(formData);
    };

    return (
        <div className="flex items-start gap-x-3 w-full">
            <FileIcon className="w-5 h-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Uploaded Files
                </p>

                <form action={onSubmit2}>
                    <Button
                        type="button"
                        onClick={onSelectFile}
                        variant="secondary"
                        size="sm"
                        className="h-8 w-auto flex justify-start font-medium py-3 px-3.5 rounded-md text-sm mb-3"
                    >
                        <div className="flex gap-x-1 items-center">
                            <FileInputIcon className="w-4 h-4" /> Upload files
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
                    {isUploading && (
                        <Button type="submit" variant="primary">
                            Upload
                        </Button>
                    )}
                </form>
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
