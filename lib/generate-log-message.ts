import { Action, AuditLog } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
    const { action, entityTitle, entityType } = log;

    switch (action) {
        case Action.CREATE: {
            return `created ${entityType.toLowerCase()} "${entityTitle}"`;
        }
        case Action.UPDATE: {
            return `updated ${entityType.toLowerCase()} "${entityTitle}"`;
        }
        case Action.DELETE: {
            return `deleted ${entityType.toLowerCase()} "${entityTitle}"`;
        }
        default: {
            return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
        }
    }
};
