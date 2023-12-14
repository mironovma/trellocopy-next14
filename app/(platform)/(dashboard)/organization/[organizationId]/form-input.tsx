"use client";

import { useFormStatus } from "react-dom";

import { Input } from "@/components/ui/input";

interface FormInputProps {
    errors?: {
        title?: string[];
    };
}

export const FormInput = ({ errors }: FormInputProps) => {
    // Для отображения статуса загрузки/отправки используем этот хук
    const { pending } = useFormStatus();

    return (
        <div>
            <Input
                type="text"
                id="title"
                name="title"
                placeholder="Enter a board title"
                required
                disabled={pending}
            />
            {/* Если будет ошибка в валидации, то выведем ее здесь: */}
            {errors?.title ? (
                <div>
                    {errors.title.map((error: string) => (
                        <p key={error} className="text-rose-500">
                            {error}
                        </p>
                    ))}
                </div>
            ) : null}
        </div>
    );
};
