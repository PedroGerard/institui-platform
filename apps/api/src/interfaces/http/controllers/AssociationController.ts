import { FastifyReply, FastifyRequest } from 'fastify';
import { AuditAction, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/database/prisma';
import { CNPJ } from '../../../domain/value-objects/CNPJ';
import { hasPermission } from '../../../application/services/AccessControlService';

const dateFromString = z.string().transform((value, context) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Data de fundacao invalida.'
        });

        return z.NEVER;
    }

    return date;
});

const createAssociationSchema = z.object({
    name: z.string().min(3, 'Nome da associacao deve ter pelo menos 3 caracteres.'),
    cnpj: z.string().min(14, 'CNPJ deve ser informado.'),
    foundationDate: dateFromString
});

const updateAssociationSchema = z.object({
    name: z.string().min(3, 'Nome da associacao deve ter pelo menos 3 caracteres.').optional(),
    cnpj: z.string().min(14, 'CNPJ deve ser informado.').optional(),
    foundationDate: dateFromString.optional()
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualizar.'
});

const associationParamsSchema = z.object({
    id: z.string().uuid()
});

type AssociationWithCounts = Prisma.AssociationGetPayload<{
    include: {
        _count: {
            select: {
                members: true;
                mandates: true;
                governanceBodies: true;
                assemblies: true;
                accountabilityProjects: true;
            };
        };
    };
}>;

function formatCnpj(value: string) {
    const digits = value.replace(/\D/g, '');

    if (digits.length !== 14) return value;

    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

function associationToDTO(association: AssociationWithCounts) {
    return {
        id: association.id,
        name: association.name,
        cnpj: association.cnpj,
        cnpjFormatted: formatCnpj(association.cnpj),
        foundationDate: association.foundationDate,
        activeStatuteId: association.activeStatuteId,
        createdAt: association.createdAt,
        updatedAt: association.updatedAt,
        counts: {
            members: association._count.members,
            mandates: association._count.mandates,
            governanceBodies: association._count.governanceBodies,
            assemblies: association._count.assemblies,
            accountabilityProjects: association._count.accountabilityProjects
        }
    };
}

const associationInclude = {
    _count: {
        select: {
            members: true,
            mandates: true,
            governanceBodies: true,
            assemblies: true,
            accountabilityProjects: true
        }
    }
} satisfies Prisma.AssociationInclude;

async function requireAssociationConfigurator(req: FastifyRequest, reply: FastifyReply, associationId: string) {
    const activeAssociationId = req.headers['x-association-id'] as string | undefined;
    const userId = req.headers['x-user-id'] as string | undefined;

    if (!activeAssociationId || activeAssociationId !== associationId) {
        reply.status(403).send({ error: 'A associacao ativa deve ser a mesma que sera configurada.' });
        return null;
    }

    if (!userId) {
        reply.status(401).send({ error: 'Selecione um usuario operador para configurar a associacao.' });
        return null;
    }

    const operator = await prisma.user.findUnique({ where: { id: userId } });

    if (!operator || operator.associationId !== associationId) {
        reply.status(403).send({ error: 'Usuario operador nao autorizado para esta associacao.' });
        return null;
    }

    if (!hasPermission(operator.role, 'ASSOCIATION_CONFIGURE')) {
        reply.status(403).send({ error: 'Usuario operador sem permissao para configurar a associacao.' });
        return null;
    }

    return operator;
}

export class AssociationController {
    static async create(req: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createAssociationSchema.parse(req.body);
            const cnpj = CNPJ.create(data.cnpj);

            const association = await prisma.association.create({
                data: {
                    name: data.name.trim(),
                    cnpj: cnpj.value,
                    foundationDate: data.foundationDate
                },
                include: associationInclude
            });

            return reply.status(201).send(associationToDTO(association));
        } catch (err: unknown) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                return reply.status(409).send({ error: 'Ja existe uma associacao cadastrada com este CNPJ.' });
            }

            const message = err instanceof Error ? err.message : 'Erro ao cadastrar associacao.';
            return reply.status(400).send({ error: message });
        }
    }

    static async list(_req: FastifyRequest, reply: FastifyReply) {
        try {
            const associations = await prisma.association.findMany({
                orderBy: { name: 'asc' },
                include: associationInclude
            });

            return reply.send(associations.map(associationToDTO));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao listar associacoes.';
            return reply.status(400).send({ error: message });
        }
    }

    static async getById(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = associationParamsSchema.parse(req.params);
            const association = await prisma.association.findUnique({
                where: { id },
                include: associationInclude
            });

            if (!association) {
                return reply.status(404).send({ error: 'Associacao nao encontrada.' });
            }

            return reply.send(associationToDTO(association));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao buscar associacao.';
            return reply.status(400).send({ error: message });
        }
    }

    static async update(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = associationParamsSchema.parse(req.params);
            const data = updateAssociationSchema.parse(req.body);
            const operator = await requireAssociationConfigurator(req, reply, id);

            if (!operator) return;

            const currentAssociation = await prisma.association.findUnique({
                where: { id },
                include: associationInclude
            });

            if (!currentAssociation) {
                return reply.status(404).send({ error: 'Associacao nao encontrada.' });
            }

            const updateData: Prisma.AssociationUpdateInput = {};

            if (data.name !== undefined) {
                updateData.name = data.name.trim();
            }

            if (data.cnpj !== undefined) {
                updateData.cnpj = CNPJ.create(data.cnpj).value;
            }

            if (data.foundationDate !== undefined) {
                updateData.foundationDate = data.foundationDate;
            }

            const association = await prisma.association.update({
                where: { id },
                data: updateData,
                include: associationInclude
            });

            await prisma.auditLog.create({
                data: {
                    associationId: id,
                    entity: 'Association',
                    entityId: id,
                    action: AuditAction.UPDATE,
                    performedById: operator.id,
                    metadata: {
                        previous: {
                            name: currentAssociation.name,
                            cnpj: currentAssociation.cnpj,
                            foundationDate: currentAssociation.foundationDate.toISOString()
                        },
                        next: {
                            name: association.name,
                            cnpj: association.cnpj,
                            foundationDate: association.foundationDate.toISOString()
                        }
                    }
                }
            });

            return reply.send(associationToDTO(association));
        } catch (err: unknown) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                return reply.status(409).send({ error: 'Ja existe uma associacao cadastrada com este CNPJ.' });
            }

            const message = err instanceof Error ? err.message : 'Erro ao atualizar associacao.';
            return reply.status(400).send({ error: message });
        }
    }
}
