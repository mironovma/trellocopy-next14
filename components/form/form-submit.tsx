"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface FormSubmitProps {
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link"
        | "primary";
}

export const FormSubmit = ({
    className,
    children,
    variant,
    disabled,
}: FormSubmitProps) => {
    const { pending } = useFormStatus();

    return (
        <Button
            disabled={pending || disabled}
            variant={variant}
            type="submit"
            size="sm"
            className={cn(className)}
        >
            {children}
        </Button>
    );
};
