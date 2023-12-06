import { ClerkProvider } from "@clerk/nextjs";

// https://clerk.com/docs/references/nextjs/custom-signup-signin-pages

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
    return <ClerkProvider>{children}</ClerkProvider>;
};

export default PlatformLayout;
