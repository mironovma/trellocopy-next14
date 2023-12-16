"use client";

import { createBoard } from "@/actions/create-board";
import { useAction } from "@/hooks/useAction";

import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";

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
                <FormInput
                    id="title"
                    errors={fieldErrors}
                    label="Board title"
                />
            </div>
            <FormSubmit>Save</FormSubmit>
        </form>
    );
};
