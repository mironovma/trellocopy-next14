/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        /**
         * Необходимо указать с какими хостами (в данном случае с photohosting)
         * можно нашему приложению взаимодействовать.
         */
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
};

module.exports = nextConfig;
