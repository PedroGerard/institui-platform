
import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
import { BaseController } from "../BaseController.js";
import { LegalEventDTO } from "../dtos/DashboardDTOs.js";

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

            const dtos: LegalEventDTO[] = events.map((event) => ({
                id: event.id,
                type: event.type,
                timestamp: event.timestamp,
                actorId: event.actorId || undefined,
                payload: event.payload
            }));

            return this.ok(reply, dtos);
        } catch (err) {
            return this.fail(reply, err as Error);
        }
    }

}
