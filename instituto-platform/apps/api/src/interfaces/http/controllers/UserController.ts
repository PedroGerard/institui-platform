import { FastifyReply, FastifyRequest } from 'fastify';
import { AuditAction, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/database/prisma';
import { getPermissionsForRole, hasPermission } from '../../../application/services/AccessControlService';

const userRoleSchema = z.enum(['ADM', 'MEMBER', 'AUDITOR']);

const createUserSchema = z.object({
    associationId: z.string().uuid(),
    name: z.string().min(3),
    email: z.string().email(),
    role: userRoleSchema
});

const updateUserRoleSchema = z.object({
    role: userRoleSchema
});

const userParamsSchema = z.object({
    id: z.string().uuid()
});

function userToDTO(user: {
    id: string;
    associationId: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}) {
    return {
        id: user.id,
        associationId: user.associationId,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

async function requireUserManager(req: FastifyRequest, reply: FastifyReply, associationId: string) {
    const activeAssociationId = req.headers['x-association-id'] as string | undefined;
    const userId = req.headers['x-user-id'] as string | undefined;

    if (!activeAssociationId || activeAssociationId !== associationId) {
        reply.status(403).send({ error: 'A associacao ativa deve ser a mesma que sera administrada.' });
        return null;
    }

    if (!userId) {
        reply.status(401).send({ error: 'Selecione um usuario operador para administrar usuarios.' });
        return null;
    }

    const operator = await prisma.user.findUnique({ where: { id: userId } });

    if (!operator || operator.associationId !== associationId) {
        reply.status(403).send({ error: 'Usuario operador nao autorizado para esta associacao.' });
        return null;
    }

    if (!hasPermission(operator.role, 'USERS_MANAGE')) {
        reply.status(403).send({ error: 'Usuario operador sem permissao para administrar usuarios.' });
        return null;
    }

    return operator;
}

export class UserController {
    static async getOperationalContext(req: FastifyRequest, reply: FastifyReply) {
        try {
            const associationId = req.headers['x-association-id'] as string | undefined;
            const userId = req.headers['x-user-id'] as string | undefined;

            if (!associationId) {
                return reply.status(400).send({ error: 'Selecione uma associacao ativa.' });
            }

            if (!userId) {
                return reply.status(400).send({ error: 'Selecione um usuario operador.' });
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (!user) {
                return reply.status(404).send({ error: 'Usuario operador nao encontrado.' });
            }

            if (user.associationId !== associationId) {
                return reply.status(403).send({ error: 'Usuario operador nao pertence a associacao ativa.' });
            }

            if (user.role === 'SYSTEM') {
                return reply.status(403).send({ error: 'Usuario de sistema nao pode operar a interface.' });
            }

            return reply.send({
                associationId,
                user: userToDTO(user),
                permissions: getPermissionsForRole(user.role),
                generatedAt: new Date().toISOString()
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao carregar contexto operacional.';
            return reply.status(400).send({ error: message });
        }
    }

    static async create(req: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createUserSchema.parse(req.body);
            const association = await prisma.association.findUnique({
                where: { id: data.associationId },
                select: { id: true }
            });

            if (!association) {
                return reply.status(404).send({ error: 'Associacao nao encontrada.' });
            }

            const existingOperationalUsers = await prisma.user.count({
                where: {
                    associationId: data.associationId,
                    role: { not: 'SYSTEM' }
                }
            });
            const isBootstrapUser = existingOperationalUsers === 0;
            const operator = isBootstrapUser
                ? null
                : await requireUserManager(req, reply, data.associationId);

            if (!isBootstrapUser && !operator) return;

            if (isBootstrapUser && data.role !== 'ADM') {
                return reply.status(400).send({ error: 'O primeiro usuario da associacao deve ser Administrador.' });
            }

            const user = await prisma.user.create({
                data: {
                    associationId: data.associationId,
                    name: data.name.trim(),
                    email: data.email.trim().toLowerCase(),
                    role: data.role
                }
            });

            await prisma.auditLog.create({
                data: {
                    associationId: data.associationId,
                    entity: 'User',
                    entityId: user.id,
                    action: AuditAction.CREATE,
                    performedById: operator?.id || user.id,
                    metadata: {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        bootstrap: isBootstrapUser
                    }
                }
            });

            return reply.status(201).send(userToDTO(user));
        } catch (err: unknown) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                return reply.status(409).send({ error: 'Ja existe um usuario cadastrado com este e-mail.' });
            }

            const message = err instanceof Error ? err.message : 'Erro ao cadastrar usuario.';
            return reply.status(400).send({ error: message });
        }
    }

    static async list(req: FastifyRequest, reply: FastifyReply) {
        try {
            const query = req.query as { associationId?: string; role?: string };
            const associationId = query.associationId || (req.headers['x-association-id'] as string | undefined);

            if (!associationId) {
                return reply.status(400).send({ error: 'Informe a associacao para listar usuarios.' });
            }

            const users = await prisma.user.findMany({
                where: {
                    associationId,
                    role: query.role ? query.role : { not: 'SYSTEM' }
                },
                orderBy: [
                    { role: 'asc' },
                    { name: 'asc' }
                ]
            });

            return reply.send(users.map(userToDTO));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao listar usuarios.';
            return reply.status(400).send({ error: message });
        }
    }

    static async getById(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = userParamsSchema.parse(req.params);
            const user = await prisma.user.findUnique({ where: { id } });

            if (!user) {
                return reply.status(404).send({ error: 'Usuario nao encontrado.' });
            }

            return reply.send(userToDTO(user));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao buscar usuario.';
            return reply.status(400).send({ error: message });
        }
    }

    static async updateRole(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = userParamsSchema.parse(req.params);
            const data = updateUserRoleSchema.parse(req.body);
            const currentUser = await prisma.user.findUnique({ where: { id } });

            if (!currentUser) {
                return reply.status(404).send({ error: 'Usuario nao encontrado.' });
            }

            if (currentUser.role === 'SYSTEM') {
                return reply.status(400).send({ error: 'Usuario de sistema nao pode ter perfil alterado.' });
            }

            const operator = await requireUserManager(req, reply, currentUser.associationId);

            if (!operator) return;

            if (currentUser.role === 'ADM' && data.role !== 'ADM') {
                const adminCount = await prisma.user.count({
                    where: {
                        associationId: currentUser.associationId,
                        role: 'ADM'
                    }
                });

                if (adminCount <= 1) {
                    return reply.status(400).send({ error: 'Nao e permitido remover o ultimo Administrador da associacao.' });
                }
            }

            const user = await prisma.user.update({
                where: { id },
                data: { role: data.role }
            });

            await prisma.auditLog.create({
                data: {
                    associationId: currentUser.associationId,
                    entity: 'User',
                    entityId: id,
                    action: AuditAction.UPDATE,
                    performedById: operator.id,
                    metadata: {
                        name: user.name,
                        email: user.email,
                        previousRole: currentUser.role,
                        role: user.role
                    }
                }
            });

            return reply.send(userToDTO(user));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil do usuario.';
            return reply.status(400).send({ error: message });
        }
    }
}
