
import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { BaseController } from "../BaseController.js";
import { LegalEventDTO } from "../dtos/DashboardDTOs.js";

// Ideally we injected a Repository/UseCase, but for raw read-only lists 
// directly from Audit Log, a simple query via Prisma is often acceptable in CQRS-lite.
// However, to stick to architecture, we can use ILegalEventRepository later.
// For now, let's keep it simple but safe.

export class LegalEventController extends BaseController {
    constructor(private prisma: PrismaClient) {
        super();
    }

    protected async executeImpl(req: FastifyRequest, reply: FastifyReply): Promise<void | any> {
        try {
            const { associationId } = req.params as { associationId: string };

            const events = await this.prisma.legalEvent.findMany({
                where: { associationId: associationId },
                orderBy: { timestamp: 'desc' },
                take: 50 // Limit for dashboard
            });

            const dtos: LegalEventDTO[] = events.map((e: any) => ({
                id: e.id,
                type: e.type,
                timestamp: e.timestamp,
                actorId: e.actorId || undefined,
                payload: e.payload
            }));

            return this.ok(reply, dtos);
        } catch (err) {
            return this.fail(reply, err as Error);
        }
    }

}
