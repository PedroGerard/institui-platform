import { FastifyReply, FastifyRequest } from 'fastify';
import { AuditAction, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/database/prisma';

const listAuditLogsSchema = z.object({
    associationId: z.string().uuid().optional(),
    action: z.nativeEnum(AuditAction).optional(),
    entity: z.string().min(1).optional(),
    performedById: z.string().uuid().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(200).optional()
});

function parseDate(value?: string) {
    if (!value) return undefined;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        throw new Error('Data de filtro invalida.');
    }

    return date;
}

function auditLogToDTO(log: {
    id: string;
    associationId: string;
    entity: string;
    entityId: string;
    action: AuditAction;
    performedById: string;
    metadata: Prisma.JsonValue;
    createdAt: Date;
    performedBy: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}) {
    return {
        id: log.id,
        associationId: log.associationId,
        entity: log.entity,
        entityId: log.entityId,
        action: log.action,
        performedById: log.performedById,
        performedBy: log.performedBy,
        metadata: log.metadata,
        createdAt: log.createdAt
    };
}

export class AuditLogController {
    static async list(req: FastifyRequest, reply: FastifyReply) {
        try {
            const query = listAuditLogsSchema.parse(req.query);
            const associationId = query.associationId || (req.headers['x-association-id'] as string | undefined);

            if (!associationId) {
                return reply.status(400).send({ error: 'Informe a associacao para consultar auditoria.' });
            }

            const dateFrom = parseDate(query.dateFrom);
            const dateTo = parseDate(query.dateTo);
            const logs = await prisma.auditLog.findMany({
                where: {
                    associationId,
                    ...(query.action ? { action: query.action } : {}),
                    ...(query.entity ? { entity: { contains: query.entity, mode: 'insensitive' } } : {}),
                    ...(query.performedById ? { performedById: query.performedById } : {}),
                    ...((dateFrom || dateTo) ? {
                        createdAt: {
                            ...(dateFrom ? { gte: dateFrom } : {}),
                            ...(dateTo ? { lte: dateTo } : {})
                        }
                    } : {})
                },
                include: {
                    performedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: query.limit || 100
            });

            return reply.send(logs.map(auditLogToDTO));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao consultar auditoria.';
            return reply.status(400).send({ error: message });
        }
    }
}
