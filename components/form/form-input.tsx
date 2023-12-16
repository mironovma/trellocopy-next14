"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { FormErrors } from "./form-errors";

interface FormInputProps {
    className?: string;
    id: string;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    defaultValue?: string;
    onBlur?: () => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    (
        {
            className,
            id,
            label,
            type,
            placeholder,
            required,
            disabled,
            errors,
            defaultValue = "",
            onBlur,
        },
        ref
    ) => {
        const { pending } = useFormStatus();

        return (
            <div className="space-y-2">
                <div className="space-y-1">
                    {label && (
                        <Label
                            htmlFor={id}
                            className="text-xs font-semibold text-neutral-700"
                        >
                            {label}
                        </Label>
                    )}
                    <Input
                        id={id}
                        ref={ref}
                        name={id}
                        required={required}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        disabled={pending || disabled}
                        onBlur={onBlur}
                        className={cn("text-sm px-2 py-1 h-7", className)}
                        aria-describedby={`${id}-error`}
                    />
                </div>
                <FormErrors id={id} errors={errors} />
            </div>
        );
    }
);

FormInput.displayName = "FormInput";
