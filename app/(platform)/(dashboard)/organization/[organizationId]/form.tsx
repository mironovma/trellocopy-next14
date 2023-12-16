"use client";

import { createBoard } from "@/actions/create-board";

import { FormButton } from "./form-button";
import { FormInput } from "./form-input";
import { useAction } from "@/hooks/useAction";

export const Form = () => {
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            console.log(data, "SUCCESS!");
        },
        onError: (error) => {
            console.error(error, "ERROR");
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;

        execute({ title });
    };

    return (
        <form action={onSubmit}>
            <div className="flex flex-col space-y-2">
                <FormInput errors={fieldErrors} />
            </div>
            <FormButton />
        </form>
    );
};
