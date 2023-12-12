import { create } from "zustand";

/**
 * Используем zustand, как простой и удобный стейт менеджер
 * Подробнее:
 * https://github.com/pmndrs/zustand
 *
 * Создаем стор с помощью create.
 * Стор - это хук. Можно туда поместить все, что угодно: примитивы, объекты, функции.
 * Состоянии должно обновляться иммутабельно и функция set объединяет состояние.
 *
 * Далее в компоненте биндим этот хук/состяоние (см. Navbar.ts):
 * const sidebar = useMobileSidebar((state) => state.isOpen) // true/false
 */

type MobileSidebarStore = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

/**
 * Создаем состояние
 */

export const useMobileSidebar = create<MobileSidebarStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
