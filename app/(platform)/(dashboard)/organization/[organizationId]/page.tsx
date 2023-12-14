import { db } from "@/lib/db";

import { Board } from "./board";
import { Form } from "./form";

/**
 * Для использования асинхронных функций/методов
 * внутри серверных компонентов, такие компоненты нужно
 * заворачивать в async.
 */

const OrganizationIdPage = async () => {
    const boards = await db.board.findMany();

    return (
        <div className="flex flex-col space-y-4">
            <Form />
            <div className="space-y-2">
                {boards.map(({ id, title }) => (
                    <Board id={id} title={title} key={id} />
                ))}
            </div>
        </div>
    );
};

export default OrganizationIdPage;
