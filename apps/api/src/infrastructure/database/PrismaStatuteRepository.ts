
import { PrismaClient } from "@prisma/client";
import { Statute, StatuteVersion } from "../../domain/entities/Statute";
import { UniqueEntityID } from "../../domain/shared/Entity";
import { DomainEventMapper } from "../../domain/events/DomainEventMapper";


export class PrismaStatuteRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findByAssociationId(associationId: UniqueEntityID): Promise<Statute | null> {
        const raw = await this.prisma.statute.findFirst({
            where: { associationId: associationId.toString() },
            include: { versions: true }
        });

        if (!raw) return null;

        const versions = raw.versions.map((v: any) => StatuteVersion.create({

            versionNumber: v.versionNumber,
            approvalDate: v.approvalDate,
            registrationDate: v.registrationDate || undefined,
            content: v.content,
            originatingAssemblyId: new UniqueEntityID(v.originatingAssemblyId),
            isConsolidated: v.isConsolidated
        }, new UniqueEntityID(v.id)));

        return Statute.create({
            associationId: new UniqueEntityID(raw.associationId),
            versions: versions,
            // activeVersionId needs to be resolved from association's activeStatuteId ideally, 
            // or stored on Statute model. In Schema I put it on Association.
            // For now, let's assume we can derive it or pass it.
        }, new UniqueEntityID(raw.id));
    }

    async save(statute: Statute): Promise<void> {
        const domainEvents = statute.domainEvents;

        await this.prisma.$transaction(async (tx: any) => {
            // Upsert Statute
            await tx.statute.upsert({
                where: { id: statute.id.toString() },
                create: {
                    id: statute.id.toString(),
                    associationId: statute.props.associationId.toString()
                },
                update: {}
            });

            // Upsert Versions
            for (const v of statute.props.versions) {
                await tx.statuteVersion.upsert({
                    where: { id: v.id.toString() },
                    create: {
                        id: v.id.toString(),
                        statuteId: statute.id.toString(),
                        versionNumber: v.props.versionNumber,
                        approvalDate: v.props.approvalDate,
                        registrationDate: v.props.registrationDate,
                        content: v.props.content,
                        originatingAssemblyId: v.props.originatingAssemblyId.toString(),
                        isConsolidated: v.props.isConsolidated
                    },
                    update: {
                        registrationDate: v.props.registrationDate // Only thing that changes
                    }
                });
            }

            // Save Events
            for (const event of domainEvents) {
                const legalEvent = DomainEventMapper.toPersistence(event, statute.props.associationId);
                await tx.legalEvent.create({
                    data: {
                        id: legalEvent.id.toString(),
                        associationId: legalEvent.props.associationId.toString(),
                        type: legalEvent.props.type,
                        timestamp: legalEvent.props.timestamp,
                        actorId: legalEvent.props.actorId?.toString(),
                        payload: legalEvent.props.payload
                    }
                });
            }
        });

        statute.clearEvents();
    }

}
