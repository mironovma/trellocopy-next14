"use client";

import { create } from "@/actions/create-board";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";

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
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter a board title"
                    required
                    className="border-black border p-1"
                />
                {/* Если будет ошибка в валидации, то выведем ее здесь: */}
                {state.errors?.title ? (
                    <div>
                        {state.errors.title.map((error: string) => (
                            <p key={error} className="text-rose-500">
                                {error}
                            </p>
                        ))}
                    </div>
                ) : null}
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
};
