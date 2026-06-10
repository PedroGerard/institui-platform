import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GovernanceRole } from "../../../domain/entities/Mandate";
import { prisma } from "../../../infrastructure/database/prisma";

const dateFromString = z.string().transform((value) => new Date(value));

const createElectionSchema = z.object({
    associationId: z.string().uuid(),
    assemblyId: z.string().uuid().optional(),
    governanceBodyId: z.string().uuid().optional(),
    title: z.string().min(3),
    description: z.string().optional(),
    termStartDate: dateFromString,
    termEndDate: dateFromString.optional()
});

const createSlateSchema = z.object({
    name: z.string().min(2),
    number: z.string().optional()
});

const createCandidateSchema = z.object({
    memberId: z.string().uuid(),
    role: z.nativeEnum(GovernanceRole),
    roleName: z.string().optional(),
    seatName: z.string().optional(),
    sortOrder: z.number().int().optional()
});

const approveElectionSchema = z.object({
    slateId: z.string().uuid(),
    votes: z.number().int().min(0).optional()
});

const createMandatesSchema = z.object({
    startDate: dateFromString.optional(),
    endDate: dateFromString.optional()
});

function normalizeSeat(value?: string | null) {
    return value?.trim().toLowerCase() || "";
}

function overlaps(startA: Date, endA: Date | null | undefined, startB: Date, endB?: Date | null) {
    const aEnd = endA ?? new Date(8640000000000000);
    const bEnd = endB ?? new Date(8640000000000000);

    return startA <= bEnd && startB <= aEnd;
}

function sameGovernanceBody(a?: string | null, b?: string | null) {
    return (!a && !b) || Boolean(a && b && a === b);
}

function toDTO(election: any) {
    return {
        id: election.id,
        associationId: election.associationId,
        assemblyId: election.assemblyId,
        governanceBodyId: election.governanceBodyId,
        title: election.title,
        description: election.description,
        status: election.status,
        termStartDate: election.termStartDate,
        termEndDate: election.termEndDate,
        approvedAt: election.approvedAt,
        createdAt: election.createdAt,
        updatedAt: election.updatedAt,
        assembly: election.assembly,
        governanceBody: election.governanceBody,
        slates: election.slates ?? [],
        mandates: election.mandates ?? []
    };
}

const electionInclude = {
    assembly: {
        select: {
            id: true,
            title: true,
            type: true,
            status: true,
            scheduledDate: true
        }
    },
    governanceBody: {
        select: {
            id: true,
            name: true,
            category: true
        }
    },
    slates: {
        include: {
            candidates: {
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
                },
                orderBy: [
                    { sortOrder: "asc" as const },
                    { createdAt: "asc" as const }
                ]
            }
        },
        orderBy: { createdAt: "asc" as const }
    },
    mandates: {
        orderBy: { startDate: "desc" as const }
    }
};

function mapGovernanceBodyRole(role: string) {
    if (role.includes("PRESIDENT")) return "PRESIDENT";
    if (role.includes("SECRETARY")) return "SECRETARY";
    if (role.includes("SUBSTITUTE")) return "SUBSTITUTE";
    return "MEMBER";
}

export class ElectionController {
    static async create(req: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createElectionSchema.parse(req.body);

            if (data.assemblyId) {
                const assembly = await prisma.assembly.findFirst({
                    where: {
                        id: data.assemblyId,
                        associationId: data.associationId
                    }
                });

                if (!assembly) {
                    return reply.status(404).send({ error: "Assembleia nao encontrada para esta associacao." });
                }
            }

            if (data.governanceBodyId) {
                const body = await prisma.governanceBody.findFirst({
                    where: {
                        id: data.governanceBodyId,
                        associationId: data.associationId,
                        isActive: true
                    }
                });

                if (!body) {
                    return reply.status(404).send({ error: "Orgao de governanca nao encontrado ou inativo." });
                }
            }

            const election = await prisma.election.create({
                data: {
                    ...data,
                    status: "REGISTERED"
                },
                include: electionInclude
            });

            return reply.status(201).send(toDTO(election));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async list(req: FastifyRequest, reply: FastifyReply) {
        try {
            const query = req.query as {
                associationId?: string;
                status?: string;
                governanceBodyId?: string;
                assemblyId?: string;
            };

            const elections = await prisma.election.findMany({
                where: {
                    ...(query.associationId ? { associationId: query.associationId } : {}),
                    ...(query.status ? { status: query.status as any } : {}),
                    ...(query.governanceBodyId ? { governanceBodyId: query.governanceBodyId } : {}),
                    ...(query.assemblyId ? { assemblyId: query.assemblyId } : {})
                },
                include: electionInclude,
                orderBy: { createdAt: "desc" }
            });

            return reply.send(elections.map(toDTO));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async getById(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const election = await prisma.election.findUnique({
                where: { id },
                include: electionInclude
            });

            if (!election) {
                return reply.status(404).send({ error: "Eleicao nao encontrada." });
            }

            return reply.send(toDTO(election));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async addSlate(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const data = createSlateSchema.parse(req.body);
            const election = await prisma.election.findUnique({ where: { id } });

            if (!election) {
                return reply.status(404).send({ error: "Eleicao nao encontrada." });
            }

            if (election.status === "MANDATES_CREATED") {
                return reply.status(400).send({ error: "Eleicao ja possui mandatos gerados." });
            }

            const slate = await prisma.electionSlate.create({
                data: {
                    electionId: id,
                    name: data.name,
                    number: data.number
                }
            });

            return reply.status(201).send(slate);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async addCandidate(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { slateId } = req.params as { slateId: string };
            const data = createCandidateSchema.parse(req.body);
            const slate = await prisma.electionSlate.findUnique({
                where: { id: slateId },
                include: { election: true }
            });

            if (!slate) {
                return reply.status(404).send({ error: "Chapa nao encontrada." });
            }

            if (slate.election.status === "MANDATES_CREATED") {
                return reply.status(400).send({ error: "Eleicao ja possui mandatos gerados." });
            }

            const member = await prisma.member.findFirst({
                where: {
                    id: data.memberId,
                    associationId: slate.election.associationId
                }
            });

            if (!member) {
                return reply.status(404).send({ error: "Membro nao pertence a esta associacao." });
            }

            if (member.status !== "ACTIVE") {
                return reply.status(400).send({ error: "Somente membro ativo pode compor chapa." });
            }

            const candidate = await prisma.electionCandidate.create({
                data: {
                    slateId,
                    memberId: data.memberId,
                    role: data.role,
                    roleName: data.roleName,
                    seatName: data.seatName,
                    sortOrder: data.sortOrder ?? 0
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

            return reply.status(201).send(candidate);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async approve(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const data = approveElectionSchema.parse(req.body);
            const election = await prisma.election.findUnique({
                where: { id },
                include: {
                    slates: {
                        include: {
                            candidates: true
                        }
                    }
                }
            });

            if (!election) {
                return reply.status(404).send({ error: "Eleicao nao encontrada." });
            }

            const electedSlate = election.slates.find((slate) => slate.id === data.slateId);

            if (!electedSlate) {
                return reply.status(404).send({ error: "Chapa nao pertence a esta eleicao." });
            }

            if (electedSlate.candidates.length === 0) {
                return reply.status(400).send({ error: "Chapa sem candidatos nao pode ser homologada." });
            }

            await prisma.$transaction(async (tx) => {
                await tx.electionSlate.updateMany({
                    where: { electionId: id },
                    data: { status: "REJECTED" }
                });

                await tx.electionSlate.update({
                    where: { id: data.slateId },
                    data: {
                        status: "ELECTED",
                        votes: data.votes
                    }
                });

                await tx.election.update({
                    where: { id },
                    data: {
                        status: "APPROVED",
                        approvedAt: new Date()
                    }
                });

                if (election.assemblyId) {
                    await tx.assemblyDeliberation.create({
                        data: {
                            assemblyId: election.assemblyId,
                            agendaItem: "Eleicao",
                            decision: `Homologada a chapa ${electedSlate.name} para ${election.title}.`,
                            result: "APPROVED",
                            requiredQuorum: "SIMPLE",
                            votesFor: data.votes
                        }
                    });
                }
            });

            const updated = await prisma.election.findUnique({
                where: { id },
                include: electionInclude
            });

            return reply.send(toDTO(updated));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async createMandates(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const data = createMandatesSchema.parse(req.body || {});
            const election = await prisma.election.findUnique({
                where: { id },
                include: {
                    slates: {
                        include: {
                            candidates: {
                                include: { member: true },
                                orderBy: [
                                    { sortOrder: "asc" },
                                    { createdAt: "asc" }
                                ]
                            }
                        }
                    }
                }
            });

            if (!election) {
                return reply.status(404).send({ error: "Eleicao nao encontrada." });
            }

            if (election.status !== "APPROVED") {
                return reply.status(400).send({ error: "Apenas eleicao homologada pode gerar mandatos." });
            }

            const electedSlate = election.slates.find((slate) => slate.status === "ELECTED");

            if (!electedSlate || electedSlate.candidates.length === 0) {
                return reply.status(400).send({ error: "Nenhuma chapa eleita encontrada." });
            }

            const startDate = data.startDate ?? election.termStartDate;
            const endDate = data.endDate ?? election.termEndDate;
            const seenMembers = new Set<string>();
            const seenSeats = new Set<string>();

            for (const candidate of electedSlate.candidates) {
                if (candidate.member.status !== "ACTIVE") {
                    return reply.status(400).send({ error: `Candidato ${candidate.member.fullName} nao esta ativo.` });
                }

                if (seenMembers.has(candidate.memberId)) {
                    return reply.status(400).send({ error: `Candidato ${candidate.member.fullName} esta duplicado na chapa.` });
                }

                seenMembers.add(candidate.memberId);

                const seatKey = `${candidate.role}:${normalizeSeat(candidate.seatName)}`;
                if (seenSeats.has(seatKey)) {
                    return reply.status(400).send({ error: `Cargo duplicado na chapa: ${candidate.role}${candidate.seatName ? ` - ${candidate.seatName}` : ""}.` });
                }
                seenSeats.add(seatKey);
            }

            const activeMandates = await prisma.mandate.findMany({
                where: {
                    associationId: election.associationId,
                    isActive: true
                }
            });

            for (const candidate of electedSlate.candidates) {
                for (const mandate of activeMandates) {
                    if (!overlaps(mandate.startDate, mandate.endDate, startDate, endDate)) {
                        continue;
                    }

                    if (mandate.memberId === candidate.memberId) {
                        return reply.status(400).send({ error: `Membro ${candidate.member.fullName} ja possui mandato ativo no periodo.` });
                    }

                    if (
                        mandate.role === candidate.role &&
                        sameGovernanceBody(mandate.governanceBodyId, election.governanceBodyId) &&
                        normalizeSeat(mandate.seatName) === normalizeSeat(candidate.seatName)
                    ) {
                        return reply.status(400).send({ error: `Ja existe mandato ativo para o cargo ${candidate.role}${candidate.seatName ? ` - ${candidate.seatName}` : ""}.` });
                    }
                }
            }

            const createdMandates = await prisma.$transaction(async (tx) => {
                const mandates = [];

                for (const candidate of electedSlate.candidates) {
                    const mandate = await tx.mandate.create({
                        data: {
                            associationId: election.associationId,
                            memberId: candidate.memberId,
                            governanceBodyId: election.governanceBodyId,
                            electionId: election.id,
                            sourceAssemblyId: election.assemblyId,
                            role: candidate.role,
                            roleName: candidate.roleName,
                            seatName: candidate.seatName,
                            startDate,
                            endDate,
                            isActive: true
                        }
                    });

                    mandates.push(mandate);

                    if (election.governanceBodyId) {
                        const existingBodyMember = await tx.governanceBodyMember.findFirst({
                            where: {
                                governanceBodyId: election.governanceBodyId,
                                memberId: candidate.memberId,
                                isActive: true
                            }
                        });

                        if (!existingBodyMember) {
                            await tx.governanceBodyMember.create({
                                data: {
                                    governanceBodyId: election.governanceBodyId,
                                    memberId: candidate.memberId,
                                    role: mapGovernanceBodyRole(candidate.role) as any,
                                    roleName: candidate.roleName ?? candidate.role,
                                    startDate,
                                    endDate,
                                    isActive: true
                                }
                            });
                        }
                    }
                }

                await tx.election.update({
                    where: { id },
                    data: { status: "MANDATES_CREATED" }
                });

                return mandates;
            });

            return reply.status(201).send(createdMandates);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }
}
