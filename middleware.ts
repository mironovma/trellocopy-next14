import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
    publicRoutes: ["/"],
    afterAuth(auth, req) {
        // Если пользователь авторизован и находится на публичном роуте
        if (auth.userId && auth.isPublicRoute) {
            // инициализируем переменную на выбор организации
            let path = "/select-org";
            // Если авторизован под организацией, то корневым роутом будет ссылка на конкретную организацию
            if (auth.orgId) {
                path = `/organization/${auth.orgId}`;
            }
            // Редирект на один из этих двух роутов
            const orgSelection = new URL(path, req.url);
            return NextResponse.redirect(orgSelection);
        }
        // Если не авторизован и находится на защищенном роуте
        if (!auth.userId && !auth.isPublicRoute) {
            // Редиректим на страницу авторизации от Clerk
            return redirectToSignIn({ returnBackUrl: req.url });
        }
        // Если авторизован, но не выбрана организация + не находится на странице выбора организации
        if (
            auth.userId &&
            !auth.orgId &&
            req.nextUrl.pathname !== "/select-org"
        ) {
            // Редиректим на выбор организации
            const orgSelection = new URL("/select-org", req.url);
            return NextResponse.redirect(orgSelection);
        }
    },
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
