"use client";

import { AuditLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/useCardModal";
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

                            {/* TODO: Uploading files */}
                            {false ? <UploadForm.Skeleton /> : <UploadForm />}

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
