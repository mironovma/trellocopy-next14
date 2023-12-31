"use client";

import { AuditLog, CardFile } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/useCardModal";
import { ToggleFeature } from "@/lib/toggle-feature";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";

import { Actions } from "./actions";
import { Activity } from "./activity";
import { Description } from "./descriptions";
import { Header } from "./header";
import { UploadForm } from "./upload-form";

export const CardModal = () => {
    const id = useCardModal((state) => state.id);
    const isOpen = useCardModal((state) => state.isOpen);
    const onClose = useCardModal((state) => state.onClose);

    // Указывает ключи (как теги в RTK Query), чтобы далее можно было по этим тегам рефетчить данные после, напр., изменений
    // https://tanstack.com/query/v4/docs/react/guides/query-invalidation
    const { data: cardData } = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`),
    });

    // Журнал действий. Возвращает массив с последними действиями
    // Указывает ключи (как теги в RTK Query), чтобы далее можно было по этим тегам рефетчить данные после, напр., изменений
    const { data: auditLogsData } = useQuery<AuditLog[]>({
        queryKey: ["card-logs", id],
        queryFn: () => fetcher(`/api/cards/${id}/logs`),
    });

    // Получаем список файлов для конкретной карточки
    const { data: cardFilesData } = useQuery<CardFile[]>({
        queryKey: ["card-files", id],
        queryFn: () => fetcher(`/api/cards/${id}/files`),
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                    <div className="col-span-3">
                        <div className="w-full space-y-6">
                            {!cardData ? (
                                <Description.Skeleton />
                            ) : (
                                <Description data={cardData} />
                            )}

                            <ToggleFeature
                                on={
                                    !cardData ? (
                                        <UploadForm.Skeleton />
                                    ) : (
                                        <UploadForm
                                            cardId={cardData && cardData.id}
                                            files={cardFilesData}
                                        />
                                    )
                                }
                                off={<></>}
                                isRelease={true}
                            />

                            {!auditLogsData ? (
                                <Activity.Skeleton />
                            ) : (
                                <Activity items={auditLogsData} />
                            )}
                        </div>
                    </div>
                    {!cardData ? (
                        <Actions.Skeleton />
                    ) : (
                        <Actions data={cardData} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
