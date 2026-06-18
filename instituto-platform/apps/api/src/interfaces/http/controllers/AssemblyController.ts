import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../../../infrastructure/database/prisma";
import { AssemblyService } from "../../../domain/services/AssemblyService";

const attendanceSchema = z.object({
    memberId: z.string().uuid().optional(),
    externalName: z.string().min(3).optional(),
    hasVotingRight: z.boolean().optional(),
    present: z.boolean().optional(),
    signedAt: z.string().datetime().optional()
}).refine((data) => data.memberId || data.externalName, {
    message: "Informe um associado ou participante externo."
});

const deliberationSchema = z.object({
    agendaItem: z.string().min(3),
    decision: z.string().min(3),
    requiredQuorum: z.string().optional(),
    votesFor: z.number().int().min(0).optional(),
    votesAgainst: z.number().int().min(0).optional(),
    abstentions: z.number().int().min(0).optional(),
    result: z.string().optional()
});

const includeAssemblyDetails = {
    attendances: {
        orderBy: { createdAt: "asc" as const },
        include: {
            member: {
                select: {
                    id: true,
                    fullName: true,
                    cpf: true,
                    status: true,
                    memberType: true
                }
            }
        }
    },
    deliberations: {
        orderBy: { createdAt: "asc" as const }
    },
    chairMember: {
        select: {
            id: true,
            fullName: true
        }
    },
    secretaryMember: {
        select: {
            id: true,
            fullName: true
        }
    }
};

function assemblyToDTO(assembly: any) {
    return {
        id: assembly.id,
        associationId: assembly.associationId,
        type: assembly.type,
        status: assembly.status,
        title: assembly.title || undefined,
        date: assembly.date,
        scheduledDate: assembly.scheduledDate,
        callDate: assembly.callDate || undefined,
        callNoticeDays: assembly.callNoticeDays,
        callMethod: assembly.callMethod || undefined,
        callNoticeText: assembly.callNoticeText || undefined,
        convenerType: assembly.convenerType || undefined,
        convenerMemberId: assembly.convenerMemberId || undefined,
        location: assembly.location || undefined,
        address: assembly.address || undefined,
        firstCallAt: assembly.firstCallAt || undefined,
        secondCallAt: assembly.secondCallAt || undefined,
        heldCallNumber: assembly.heldCallNumber || undefined,
        totalVotingMembers: assembly.totalVotingMembers ?? undefined,
        presentVotingMembers: assembly.presentVotingMembers ?? undefined,
        quorumMet: assembly.quorumMet ?? undefined,
        chairMemberId: assembly.chairMemberId || undefined,
        secretaryMemberId: assembly.secretaryMemberId || undefined,
        chairMember: assembly.chairMember || undefined,
        secretaryMember: assembly.secretaryMember || undefined,
        minutesContent: assembly.minutesContent || undefined,
        agenda: assembly.agendaItemIds || [],
        createdAt: assembly.createdAt,
        updatedAt: assembly.updatedAt,
        attendances: assembly.attendances?.map(attendanceToDTO) || [],
        deliberations: assembly.deliberations?.map(deliberationToDTO) || []
    };
}

function attendanceToDTO(attendance: any) {
    return {
        id: attendance.id,
        assemblyId: attendance.assemblyId,
        memberId: attendance.memberId || undefined,
        externalName: attendance.externalName || undefined,
        hasVotingRight: attendance.hasVotingRight,
        present: attendance.present,
        signedAt: attendance.signedAt || undefined,
        createdAt: attendance.createdAt,
        updatedAt: attendance.updatedAt,
        member: attendance.member || undefined
    };
}

function deliberationToDTO(deliberation: any) {
    return {
        id: deliberation.id,
        assemblyId: deliberation.assemblyId,
        agendaItem: deliberation.agendaItem,
        decision: deliberation.decision,
        result: deliberation.result,
        requiredQuorum: deliberation.requiredQuorum || undefined,
        votesFor: deliberation.votesFor ?? undefined,
        votesAgainst: deliberation.votesAgainst ?? undefined,
        abstentions: deliberation.abstentions ?? undefined,
        createdAt: deliberation.createdAt
    };
}

export class AssemblyController {
    static async list(req: FastifyRequest, reply: FastifyReply) {
        try {
            const query = req.query as { associationId?: string; status?: string; type?: string };
            const associationId = query.associationId || (req.headers["x-association-id"] as string | undefined);

            const assemblies = await prisma.assembly.findMany({
                where: {
                    ...(associationId ? { associationId } : {}),
                    ...(query.status ? { status: query.status } : {}),
                    ...(query.type ? { type: query.type } : {})
                },
                orderBy: { scheduledDate: "desc" },
                include: includeAssemblyDetails
            });

            return reply.send(assemblies.map(assemblyToDTO));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async getById(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const assembly = await prisma.assembly.findUnique({
                where: { id },
                include: includeAssemblyDetails
            });

            if (!assembly) {
                return reply.status(404).send({ error: "Assembly not found" });
            }

            return reply.send(assemblyToDTO(assembly));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async addAttendance(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const data = attendanceSchema.parse(req.body);
            const assembly = await prisma.assembly.findUnique({
                where: { id },
                select: { id: true, associationId: true }
            });

            if (!assembly) {
                return reply.status(404).send({ error: "Assembly not found" });
            }

            if (data.memberId) {
                const member = await prisma.member.findUnique({
                    where: { id: data.memberId },
                    select: { associationId: true, status: true }
                });

                if (!member || member.associationId !== assembly.associationId) {
                    return reply.status(400).send({ error: "Member does not belong to this association" });
                }
            }

            const attendance = await prisma.assemblyAttendance.create({
                data: {
                    assemblyId: id,
                    memberId: data.memberId,
                    externalName: data.externalName,
                    hasVotingRight: data.hasVotingRight ?? Boolean(data.memberId),
                    present: data.present ?? true,
                    signedAt: data.signedAt ? new Date(data.signedAt) : undefined
                },
                include: {
                    member: {
                        select: {
                            id: true,
                            fullName: true,
                            cpf: true,
                            status: true,
                            memberType: true
                        }
                    }
                }
            });

            return reply.status(201).send(attendanceToDTO(attendance));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async addDeliberation(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const data = deliberationSchema.parse(req.body);
            const assembly = await prisma.assembly.findUnique({
                where: { id },
                select: { id: true, presentVotingMembers: true }
            });

            if (!assembly) {
                return reply.status(404).send({ error: "Assembly not found" });
            }

            const requiresTwoThirds = data.requiredQuorum === "TWO_THIRDS";
            const result = data.result || (
                requiresTwoThirds && data.votesFor !== undefined && assembly.presentVotingMembers
                    ? AssemblyService.calculateSpecialApproval(data.votesFor, assembly.presentVotingMembers) ? "APPROVED" : "REJECTED"
                    : "APPROVED"
            );

            const deliberation = await prisma.assemblyDeliberation.create({
                data: {
                    assemblyId: id,
                    agendaItem: data.agendaItem,
                    decision: data.decision,
                    requiredQuorum: data.requiredQuorum,
                    votesFor: data.votesFor,
                    votesAgainst: data.votesAgainst,
                    abstentions: data.abstentions,
                    result
                }
            });

            return reply.status(201).send(deliberationToDTO(deliberation));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }
}
