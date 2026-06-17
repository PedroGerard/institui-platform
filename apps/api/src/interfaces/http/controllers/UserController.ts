import { FastifyReply, FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../../infrastructure/database/prisma';
import { getPermissionsForRole } from '../../../application/services/AccessControlService';

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

            const user = await prisma.user.create({
                data: {
                    associationId: data.associationId,
                    name: data.name.trim(),
                    email: data.email.trim().toLowerCase(),
                    role: data.role
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

            const user = await prisma.user.update({
                where: { id },
                data: { role: data.role }
            });

            return reply.send(userToDTO(user));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Erro ao atualizar perfil do usuario.';
            return reply.status(400).send({ error: message });
        }
    }
}
