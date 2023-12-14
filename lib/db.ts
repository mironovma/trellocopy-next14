import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

/**
 * Т.к. в дев режиме у нас стоит hot reload, то
 * при каждой пересборке проекта будут вылетать warning'и.
 * Чтобы этого не было, инициализируем переменную и декларируем так.
 * globalThis.prisma будет игнорироваться при релоаде и новых эземпляров PrismaClient не будет.
 */

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
