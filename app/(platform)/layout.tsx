import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";

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
            <QueryProvider>
                <Toaster />
                <ModalProvider />
                {children}
            </QueryProvider>
        </ClerkProvider>
    );
};

export default PlatformLayout;
