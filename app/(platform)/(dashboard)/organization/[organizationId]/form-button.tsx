"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export const FormButton = () => {
    // Для отображения статуса загрузки/отправки используем этот хук
    /**
     * Можно использовать этот хук в отдельных компонентах формы,
     * например, как этот.
     * Он будет работать только в том случае, если в последующем
     * этот компонент будет внутри формы, как в form.tsx
     */
    const { pending } = useFormStatus();

    return (
        <Button disabled={pending} type="submit">
            Submit
        </Button>
    );
};
