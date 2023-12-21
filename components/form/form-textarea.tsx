"use client";

import { KeyboardEventHandler, forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { FormErrors } from "./form-errors";

interface FormTextareaProps {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    defaultValue?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement | undefined>;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    (
        {
            className,
            id,
            label,
            placeholder,
            required,
            disabled,
            errors,
            defaultValue,
            onBlur,
            onClick,
            onKeyDown,
        },
        ref
    ) => {
        const { pending } = useFormStatus();

        return (
            <div className="space-y-2 w-full">
                <div className="space-y-1 w-full">
                    {label && (
                        <Label
                            htmlFor={id}
                            className="text-xs font-semibold text-neutral-700"
                        >
                            {label}
                        </Label>
                    )}
                    <Textarea
                        ref={ref}
                        required={required}
                        placeholder={placeholder}
                        name={id}
                        id={id}
                        disabled={pending || disabled}
                        onKeyDown={onKeyDown}
                        onBlur={onBlur}
                        onClick={onClick}
                        className={cn(
                            "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
                            className
                        )}
                        defaultValue={defaultValue}
                        aria-describedby={`${id}-error`}
                    />
                </div>
                <FormErrors id={id} errors={errors} />
            </div>
        );
    }
);

FormTextarea.displayName = "FormTextarea";
