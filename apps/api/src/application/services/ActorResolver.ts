import { PrismaClient } from "@prisma/client";

function systemUserEmail(associationId: string) {
    return `system-${associationId}@institui.local`;
}

export async function resolveActor(prisma: PrismaClient, associationId: string, actorId?: string) {
    if (actorId) {
        const user = await prisma.user.findUnique({ where: { id: actorId } });

        if (user) {
            return user.id;
        }
    }

    const existingUser = await prisma.user.findFirst({
        where: { associationId },
        orderBy: { createdAt: "asc" }
    });

    if (existingUser) {
        return existingUser.id;
    }

    const email = systemUserEmail(associationId);
    const systemUser = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            associationId,
            name: "Sistema INSTITUI+",
            email,
            role: "SYSTEM"
        }
    });

    return systemUser.id;
}

export async function resolveOptionalActor(prisma: PrismaClient, associationId: string, actorId?: string) {
    if (!actorId) {
        return undefined;
    }

    return resolveActor(prisma, associationId, actorId);
}
