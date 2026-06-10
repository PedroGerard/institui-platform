
import { PrismaClient } from "@prisma/client";
import { LegalEvent } from "../../domain/entities/LegalEvent";
import { UniqueEntityID } from "../../domain/shared/Entity";

export class PrismaLegalEventRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async save(event: LegalEvent): Promise<void> {
        await this.prisma.legalEvent.create({
            data: {
                id: event.id.toString(),
                associationId: event.props.associationId.toString(),
                type: event.props.type,
                timestamp: event.props.timestamp,
                actorId: event.props.actorId?.toString(),
                payload: event.props.payload
            }
        });
    }
}
