
import { FastifyRequest, FastifyReply } from "fastify";
import { BaseController } from "../BaseController.js";
import { HoldAssemblyUseCase } from "../../../application/use-cases/HoldAssembly.js";
import { z } from "zod";
import { prisma } from "../../../infrastructure/database/prisma.js";
import { requireOperationalPermission } from "../OperationalAuth.js";

export class HoldAssemblyController extends BaseController {
    private useCase: HoldAssemblyUseCase;

    constructor(useCase: HoldAssemblyUseCase) {
        super();
        this.useCase = useCase;
    }

    protected async executeImpl(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const paramsSchema = z.object({
            id: z.string().uuid()
        });
        const bodySchema = z.object({
            heldAt: z.string().datetime().optional(),
            heldCallNumber: z.number().int().min(1).max(2).optional(),
            totalVotingMembers: z.number().int().min(0).optional(),
            presentVotingMembers: z.number().int().min(0).optional(),
            chairMemberId: z.string().uuid().optional(),
            secretaryMemberId: z.string().uuid().optional()
        });

        const params = paramsSchema.parse(req.params);
        const body = bodySchema.parse(req.body || {});
        const assembly = await prisma.assembly.findUnique({
            where: { id: params.id },
            select: { associationId: true }
        });

        if (!assembly) {
            return res.status(404).send({ error: "Assembly not found" });
        }

        const auth = await requireOperationalPermission(req, res, {
            permission: "GOVERNANCE_MANAGE",
            associationId: assembly.associationId
        });
        if (!auth) return;

        await this.useCase.execute({
            assemblyId: params.id,
            heldAt: body.heldAt ? new Date(body.heldAt) : undefined,
            heldCallNumber: body.heldCallNumber,
            totalVotingMembers: body.totalVotingMembers,
            presentVotingMembers: body.presentVotingMembers,
            chairMemberId: body.chairMemberId,
            secretaryMemberId: body.secretaryMemberId
        });

        return res.status(200).send({ message: "Assembly held successfully. Status updated." });
    }
}
