import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

// https://clerk.com/docs/references/nextjs/custom-signup-signin-pages

/**
 * Sonner
 * Красивые попап нотификации.
 * Подробнее:
 * https://sonner.emilkowal.ski/
 */

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider>
            <Toaster />
            {children}
        </ClerkProvider>
    );
};

export default PlatformLayout;
