import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";

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
            <Button type="submit" variant={"destructive"} size={"sm"}>
                Delete
            </Button>
        </form>
    );
};
