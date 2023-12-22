"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { updateCardOrder } from "@/actions/update-card-order";
import { updateListOrder } from "@/actions/update-list-order";
import { useAction } from "@/hooks/useAction";
import { ListWithCards } from "@/types";

import { ListForm } from "./list-form";
import { ListItem } from "./list-item";

interface ListContainerProps {
    data: ListWithCards[];
    boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("List reordered!");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Card reordered!");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        // Если будет дропнут на ту же позицию, то ничего не делаем
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Если дропаем список
        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map((item, index) => ({ ...item, order: index }));

            // На фронте делаем визуальное отображение перемещения (локально)
            /**
             * Таким образом делаем optimistic update - предварительно обновление состояния
             * приложения сразу до отправки запроса на сервер, даже до получения ответа от сервера.
             * Это позволяет делать более отзывчивый UI, т.к. пользователь сразу видит изменения, которые он сделал,
             * в то время как фактическое обновление данных все еще обрабатывается на сервере.
             */
            setOrderedData(items);

            // На сервере меняем порядок списка
            executeUpdateListOrder({ items, boardId });
        }

        // Если дропаем отдельную карточку
        if (type === "card") {
            let newOrderedData = [...orderedData];

            // Из какого списка и в какой перебрасываем карточку
            // Получаем исходный список карточки
            const sourceList = newOrderedData.find(
                (list) => list.id === source.droppableId
            );
            // Получаем список, в который перебрасываем
            const destList = newOrderedData.find(
                (list) => list.id === destination.droppableId
            );

            if (!sourceList || !destList) {
                return;
            }

            // Если карточек в исходном списке нет
            if (!sourceList.cards) {
                sourceList.cards = [];
            }

            // Есть ли карточки в списке, в который перемещаем
            if (!destList.cards) {
                destList.cards = [];
            }

            // Перемещаем карточку в тот же список, то именно в этом списке меняем порядок
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                );

                reorderedCards.forEach((card, idx) => {
                    card.order = idx;
                });

                sourceList.cards = reorderedCards;

                // Меняем порядок на фронте
                setOrderedData(newOrderedData);

                // Меняем на бэке порядок
                executeUpdateCardOrder({ boardId, items: reorderedCards });
            } else {
                // Если перемещаем карточку в другой список
                // 1. Удаляем карточку из исходного списка
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                // 2. Даем новый listId этой карточке
                movedCard.listId = destination.droppableId;

                // 3. Добавляем карточку в новый список
                destList.cards.splice(destination.index, 0, movedCard);

                // 4. Меняем порядок в исходном списке, т.к. убрали карточку
                sourceList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                // 5. Обновляем порядок в другом списке, т.к. добавили карточку
                destList.cards.forEach((card, idx) => {
                    card.order = idx;
                });

                // Меняем порядок на фронте
                setOrderedData(newOrderedData);

                // Меняем порядок на бэке
                executeUpdateCardOrder({ boardId, items: destList.cards });
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {/* type="list" */}
            <Droppable droppableId="list" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {orderedData.map((list, index) => (
                            <ListItem key={list.id} index={index} data={list} />
                        ))}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    );
};
