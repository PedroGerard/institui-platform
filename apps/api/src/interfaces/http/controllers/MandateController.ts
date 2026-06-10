import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { CloseMandate } from '../../../application/usecases/mandates/CloseMandate';
import { CreateMandate } from '../../../application/usecases/mandates/CreateMandate';
import { ListMandates } from '../../../application/usecases/mandates/ListMandates';
import { GovernanceRole, Mandate } from '../../../domain/entities/Mandate';
import { PrismaMandateRepository } from '../../../infrastructure/database/PrismaMandateRepository';
import { PrismaMemberRepository } from '../../../infrastructure/database/PrismaMemberRepository';
import { prisma } from '../../../infrastructure/database/prisma';

const dateFromString = z.string().transform((value) => new Date(value));

const createMandateSchema = z.object({
    associationId: z.string().uuid(),
    memberId: z.string().uuid(),
    governanceBodyId: z.string().uuid().optional(),
    electionId: z.string().uuid().optional(),
    sourceAssemblyId: z.string().uuid().optional(),
    role: z.nativeEnum(GovernanceRole),
    roleName: z.string().optional(),
    seatName: z.string().optional(),
    startDate: dateFromString,
    endDate: dateFromString.optional()
});

const closeMandateSchema = z.object({
    endDate: dateFromString.optional()
});

function mandateToDTO(mandate: Mandate) {
    return {
        id: mandate.id.toString(),
        associationId: mandate.associationId.toString(),
        memberId: mandate.memberId.toString(),
        governanceBodyId: mandate.governanceBodyId?.toString(),
        electionId: mandate.electionId?.toString(),
        sourceAssemblyId: mandate.sourceAssemblyId?.toString(),
        role: mandate.role,
        roleName: mandate.roleName,
        seatName: mandate.seatName,
        startDate: mandate.startDate,
        endDate: mandate.endDate,
        isActive: mandate.isActive,
        createdAt: mandate.createdAt,
        updatedAt: mandate.updatedAt
    };
}

export class MandateController {
    static async create(req: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createMandateSchema.parse(req.body);
            const mandateRepo = new PrismaMandateRepository(prisma);
            const memberRepo = new PrismaMemberRepository(prisma);
            const useCase = new CreateMandate(mandateRepo, memberRepo);
            const mandate = await useCase.execute(data);

            return reply.status(201).send(mandateToDTO(mandate));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async list(req: FastifyRequest, reply: FastifyReply) {
        try {
            const query = req.query as { associationId?: string };
            const associationId = query.associationId || (req.headers['x-association-id'] as string | undefined);
            const repo = new PrismaMandateRepository(prisma);
            const useCase = new ListMandates(repo);
            const mandates = await useCase.execute(associationId);

            return reply.send(mandates.map(mandateToDTO));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async listActive(req: FastifyRequest, reply: FastifyReply) {
        try {
            const query = req.query as { associationId?: string };
            const associationId = query.associationId || (req.headers['x-association-id'] as string | undefined);
            const repo = new PrismaMandateRepository(prisma);
            const useCase = new ListMandates(repo);
            const mandates = await useCase.execute(associationId, true);

            return reply.send(mandates.map(mandateToDTO));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async close(req: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = req.params as { id: string };
            const data = closeMandateSchema.parse(req.body || {});
            const repo = new PrismaMandateRepository(prisma);
            const useCase = new CloseMandate(repo);
            const mandate = await useCase.execute({
                mandateId: id,
                endDate: data.endDate
            });

            return reply.send(mandateToDTO(mandate));
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }
}
