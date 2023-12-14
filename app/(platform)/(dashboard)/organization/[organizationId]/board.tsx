import { deleteBoard } from "@/actions/delete-board";

import { FormDelete } from "./form-delete";

interface BoardProps {
    title: string;
    id: string;
}

export const Board = ({ id, title }: BoardProps) => {
    /**
     * Чтобы в form action передать функцию, которая ожидает аргументы,
     * необходимо ее забиндить таким образом, а далее уже передавать.
     */
    const deleteBoardWithId = deleteBoard.bind(null, id);

    return (
        <form action={deleteBoardWithId} className="flex items-center gap-x-2">
            <p>Board title: {title}</p>
            <FormDelete />
        </form>
    );
};
