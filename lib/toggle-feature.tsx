interface ToggleFeatureProps {
    on: React.ReactElement;
    off: React.ReactElement;
    isRelease: boolean;
}

export const ToggleFeature = ({ on, off, isRelease }: ToggleFeatureProps) => {
    /**
     * Можно реализовать фичу по получению из БД на каждого пользователя фича-флаги.
     * Если у пользователя есть конкретный фича-флаг, то фичу включаем, иначе нет.
     */

    if (isRelease) {
        return on;
    }

    return off;
};
