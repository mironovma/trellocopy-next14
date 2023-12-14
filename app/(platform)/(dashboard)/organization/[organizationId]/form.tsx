"use client";

import { useFormState } from "react-dom";

import { create } from "@/actions/create-board";

import { FormButton } from "./form-button";
import { FormInput } from "./form-input";

export const Form = () => {
    /**
     * Обработка ошибок
     */
    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useFormState(create, initialState);

    /**
     * В form action используем теперь dispatch.
     * Функцию по созданию новой записи в БД уже задиспатчили в useFormState.
     * Это работает по типу редюсера.
     */
    return (
        <form action={dispatch}>
            <div className="flex flex-col space-y-2">
                <FormInput errors={state?.errors} />
            </div>
            <FormButton />
        </form>
    );
};
