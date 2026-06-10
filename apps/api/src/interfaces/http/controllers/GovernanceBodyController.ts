import { FastifyReply, FastifyRequest } from "fastify";
import { GovernanceBodyCategory, GovernanceBodyMemberRole, MemberStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../../infrastructure/database/prisma";

const dateFromString = z.string().transform((value) => new Date(value));

const createGovernanceBodySchema = z.object({
    associationId: z.string().uuid(),
    name: z.string().min(3),
    category: z.nativeEnum(GovernanceBodyCategory),
    description: z.string().optional(),
    isStatutory: z.boolean().optional(),
    isActive: z.boolean().optional()
});

const updateGovernanceBodySchema = z.object({
    name: z.string().min(3).optional(),
    category: z.nativeEnum(GovernanceBodyCategory).optional(),
    description: z.string().optional(),
    isStatutory: z.boolean().optional(),
    isActive: z.boolean().optional()
});

const addGovernanceBodyMemberSchema = z.object({
    memberId: z.string().uuid().optional(),
    externalName: z.string().min(3).optional(),
    externalEmail: z.string().email().optional().or(z.literal("")),
    role: z.nativeEnum(GovernanceBodyMemberRole),
    roleName: z.string().optional(),
    startDate: dateFromString,
    endDate: dateFromString.optional()
}).refine((data) => data.memberId || data.externalName, {
    message: "Informe um membro cadastrado ou um participante externo."
});

const closeGovernanceBodyMemberSchema = z.object({
    endDate: dateFromString.optional()
});

const bodyInclude = {
    members: {
        orderBy: [
            { isActive: "desc" as const },
            { startDate: "desc" as const }
        ],
        include: {
            member: {
                select: {
                    id: true,
                    fullName: true,
                    cpf: true,
                    email: true,
                    status: true
                }
            }
        }
    }
};

function bodyToDTO(body: any) {
    return {
        id: body.id,
        associationId: body.associationId,
        name: body.name,
        category: body.category,
        description: body.description || undefined,
        isStatutory: body.isStatutory,
        isActive: body.isActive,
        createdAt: body.createdAt,
        updatedAt: body.updatedAt,
        members: body.members?.map(memberToDTO) || []
    };
}

function memberToDTO(member: any) {
    return {
        id: member.id,
        governanceBodyId: member.governanceBodyId,
        memberId: member.memberId || undefined,
        externalName: member.externalName || undefined,
        externalEmail: member.externalEmail || undefined,
        role: member.role,
        roleName: member.roleName || undefined,
        startDate: member.startDate,
        endDate: member.endDate || undefined,
        isActive: member.isActive,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        member: member.member ? {
            id: member.member.id,
            fullName: member.member.fullName,
            cpf: member.member.cpf,
            email: member.member.email || undefined,
            status: member.member.status
        } : undefined
    };
}

export class GovernanceBodyController {
    static async create(req: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createGovernanceBodySchema.parse(req.body);
            const association = await prisma.association.findUnique({
                where: { id: data.associationId },
                select: { id: true }
            });

            if (!association) {
                return reply.status(404).send({ error: "Association not found" });
            }

            const body = await prisma.governanceBody.create({
                data: {
                    associationId: data.associationId,
                    name: data.name,
                    category: data.category,
                    description: data.description,
                    isStatutory: data.isStatutory ?? false,
                    isActive: data.isActive ?? true
                },
                include: bodyInclude
            });

            return reply.status(201).send(bodyToDTO(body));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async list(req: FastifyRequest, reply: FastifyReply) {
        try {
            const query = req.query as { associationId?: string; category?: GovernanceBodyCategory; active?: string };
            const associationId = query.associationId || (req.headers["x-association-id"] as string | undefined);

            const bodies = await prisma.governanceBody.findMany({
                where: {
                    ...(associationId ? { associationId } : {}),
                    ...(query.category ? { category: query.category } : {}),
                    ...(query.active === "true" ? { isActive: true } : {}),
                    ...(query.active === "false" ? { isActive: false } : {})
                },
                orderBy: [
                    { isActive: "desc" },
                    { name: "asc" }
                ],
                include: bodyInclude
            });

            return reply.send(bodies.map(bodyToDTO));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async getById(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const body = await prisma.governanceBody.findUnique({
                where: { id },
                include: bodyInclude
            });

            if (!body) {
                return reply.status(404).send({ error: "Governance body not found" });
            }

            return reply.send(bodyToDTO(body));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async update(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const data = updateGovernanceBodySchema.parse(req.body);
            const body = await prisma.governanceBody.update({
                where: { id },
                data,
                include: bodyInclude
            });

            return reply.send(bodyToDTO(body));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async addMember(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const data = addGovernanceBodyMemberSchema.parse(req.body);
            const body = await prisma.governanceBody.findUnique({
                where: { id },
                select: { id: true, associationId: true }
            });

            if (!body) {
                return reply.status(404).send({ error: "Governance body not found" });
            }

            if (data.memberId) {
                const member = await prisma.member.findUnique({
                    where: { id: data.memberId },
                    select: { associationId: true, status: true }
                });

                if (!member || member.associationId !== body.associationId) {
                    return reply.status(400).send({ error: "Member does not belong to this association" });
                }

                if (member.status !== MemberStatus.ACTIVE) {
                    return reply.status(400).send({ error: "Only active members can be assigned to governance bodies" });
                }
            }

            const governanceMember = await prisma.governanceBodyMember.create({
                data: {
                    governanceBodyId: id,
                    memberId: data.memberId,
                    externalName: data.externalName,
                    externalEmail: data.externalEmail || undefined,
                    role: data.role,
                    roleName: data.roleName,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    isActive: !data.endDate
                },
                include: {
                    member: {
                        select: {
                            id: true,
                            fullName: true,
                            cpf: true,
                            email: true,
                            status: true
                        }
                    }
                }
            });

            return reply.status(201).send(memberToDTO(governanceMember));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async closeMember(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { memberId } = req.params as { memberId: string };
            const data = closeGovernanceBodyMemberSchema.parse(req.body || {});
            const governanceMember = await prisma.governanceBodyMember.update({
                where: { id: memberId },
                data: {
                    endDate: data.endDate || new Date(),
                    isActive: false
                },
                include: {
                    member: {
                        select: {
                            id: true,
                            fullName: true,
                            cpf: true,
                            email: true,
                            status: true
                        }
                    }
                }
            });

            return reply.send(memberToDTO(governanceMember));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }
}
