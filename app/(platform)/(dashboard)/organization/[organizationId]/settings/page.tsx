import { OrganizationProfile } from "@clerk/nextjs";

const SettingsPage = () => {
    return (
        <div className="w-full">
            <OrganizationProfile
                appearance={{
                    /**
                     * Благодаря пропу appearance в Clerk
                     * можно кастомизировать компоненты.
                     * Напр., тут убрали тени и растянули компонент на всю ширину.
                     */
                    elements: {
                        rootBox: {
                            boxShadow: "none",
                            width: "100%",
                        },
                        card: {
                            border: "1px solid #e5e5e5",
                            boxShadow: "none",
                            width: "100%",
                        },
                    },
                }}
            />
        </div>
    );
};

export default SettingsPage;
