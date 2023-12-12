"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useMobileSidebar } from "@/hooks/useMobileSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export const MobileSidebar = () => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    /**
     * Используем zustand, как менеджер состояний.
     */
    // Получаем функцию onOpen (в редаксе это называлось бы редюсером (функция, которая отвечает за изменение состояния))
    const onOpen = useMobileSidebar((state) => state.onOpen);
    // Получаем onClose
    const onClose = useMobileSidebar((state) => state.onClose);
    // Получаем состояние isOpen
    const isOpen = useMobileSidebar((state) => state.isOpen);

    /**
     * По-умолчанию все компоненты в next.js серверные.
     * Даже если мы пометим компонент "use client" это не гарантирует
     * того, что не появятся ошибки при гидрации.
     *
     * Гидрация - это процесс, когда на стороне клиента браузер "восстанавливает" HTML-разметку
     * из серверно-сгенерированного контента и превращает его в интерактивные компоненты.
     * Это позволяет сохранить состояние приложения и обеспечить более быструю загрузку страницы для пользователей.
     *
     * Чтобы гарантировать, что компонет точно будет клиентским,
     * нужно использовать такой хак: использовать внутри компонента useEffect.
     * Внутри него мы просто помещаем стейт: вмонтирован ли компонент или нет.
     */

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // При изменении pathname или вызове onClose будет работать этот useEffect
    // Изменился pathname? Вызываем onClose
    useEffect(() => {
        onClose();
    }, [onClose, pathname]);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <Button
                onClick={onOpen}
                className="block md:hidden mr-2"
                variant={"ghost"}
                size={"sm"}
            >
                <Menu className="h-4 w-4" />
            </Button>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side={"left"} className="p-2 pt-10">
                    <Sidebar storageKey="t-sidebar-mobile-state" />
                </SheetContent>
            </Sheet>
        </>
    );
};
