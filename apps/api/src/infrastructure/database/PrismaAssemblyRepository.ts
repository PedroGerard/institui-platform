
import { IAssemblyRepository } from "../../domain/repositories/Interfaces";
import { Assembly, AssemblyType, AssemblyStatus } from "../../domain/entities/Assembly";
import { UniqueEntityID } from "../../domain/shared/Entity";
import { PrismaClient } from "@prisma/client";
import { DomainEventMapper } from "../../domain/events/DomainEventMapper";


export class PrismaAssemblyRepository implements IAssemblyRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findById(id: UniqueEntityID): Promise<Assembly | null> {
        const raw = await this.prisma.assembly.findUnique({
            where: { id: id.toString() }
        });

        if (!raw) return null;

        // Map Prisma -> Domain
        // We need to support 'create' from raw data. 
        // Ideally domain classes should have a Mapper, but here we do manual mapping.
        // Assembly.create usually is for NEW entities. For existing, maybe we need a public constructor or a Mapper static method.
        // For now we assume create can restore state or we add a "Method: Map" to Entity.

        // Hack: Casting strings to Enums
        const type = raw.type as AssemblyType;
        const status = raw.status as AssemblyStatus;

        return Assembly.create({
            associationId: new UniqueEntityID(raw.associationId),
            type: type,
            date: raw.date,
            scheduledDate: raw.scheduledDate,
            status: status,
            agendaItemIds: raw.agendaItemIds,
            callNoticeDays: raw.callNoticeDays,
            title: raw.title ?? undefined,
            callDate: raw.callDate ?? undefined,
            callMethod: raw.callMethod ?? undefined,
            callNoticeText: raw.callNoticeText ?? undefined,
            convenerType: raw.convenerType ?? undefined,
            convenerMemberId: raw.convenerMemberId ? new UniqueEntityID(raw.convenerMemberId) : undefined,
            location: raw.location ?? undefined,
            address: raw.address ?? undefined,
            firstCallAt: raw.firstCallAt ?? undefined,
            secondCallAt: raw.secondCallAt ?? undefined,
            heldCallNumber: raw.heldCallNumber ?? undefined,
            totalVotingMembers: raw.totalVotingMembers ?? undefined,
            presentVotingMembers: raw.presentVotingMembers ?? undefined,
            quorumMet: raw.quorumMet ?? undefined,
            chairMemberId: raw.chairMemberId ? new UniqueEntityID(raw.chairMemberId) : undefined,
            secretaryMemberId: raw.secretaryMemberId ? new UniqueEntityID(raw.secretaryMemberId) : undefined,
            minutesContent: raw.minutesContent ?? undefined
        }, new UniqueEntityID(raw.id));
    }

    async findByScheduledDate(associationId: UniqueEntityID, type: AssemblyType, date: Date): Promise<Assembly | null> {
        // Find existing assembly for same association, type and date (scheduled)
        // Ignoring status for now, or maybe only checking non-canceled ones?
        // User requirement: "Duplicate Act". Usually means same day/time.
        const raw = await this.prisma.assembly.findFirst({
            where: {
                associationId: associationId.toString(),
                type: type,
                scheduledDate: date
            }
        });

        if (!raw) return null;

        // Map Prisma -> Domain (Duplicated logic, should extract to private method helper)
        return Assembly.create({
            associationId: new UniqueEntityID(raw.associationId),
            type: raw.type as AssemblyType,
            date: raw.date,
            scheduledDate: raw.scheduledDate,
            status: raw.status as AssemblyStatus,
            agendaItemIds: raw.agendaItemIds,
            callNoticeDays: raw.callNoticeDays,
            title: raw.title ?? undefined,
            callDate: raw.callDate ?? undefined,
            callMethod: raw.callMethod ?? undefined,
            callNoticeText: raw.callNoticeText ?? undefined,
            convenerType: raw.convenerType ?? undefined,
            convenerMemberId: raw.convenerMemberId ? new UniqueEntityID(raw.convenerMemberId) : undefined,
            location: raw.location ?? undefined,
            address: raw.address ?? undefined,
            firstCallAt: raw.firstCallAt ?? undefined,
            secondCallAt: raw.secondCallAt ?? undefined,
            heldCallNumber: raw.heldCallNumber ?? undefined,
            totalVotingMembers: raw.totalVotingMembers ?? undefined,
            presentVotingMembers: raw.presentVotingMembers ?? undefined,
            quorumMet: raw.quorumMet ?? undefined,
            chairMemberId: raw.chairMemberId ? new UniqueEntityID(raw.chairMemberId) : undefined,
            secretaryMemberId: raw.secretaryMemberId ? new UniqueEntityID(raw.secretaryMemberId) : undefined,
            minutesContent: raw.minutesContent ?? undefined
        }, new UniqueEntityID(raw.id));
    }

    async save(assembly: Assembly): Promise<void> {

        const data = {
            id: assembly.id.toString(),
            associationId: assembly.props.associationId.toString(),
            type: assembly.props.type,
            status: assembly.props.status,
            date: assembly.props.date,
            scheduledDate: assembly.props.scheduledDate,
            callNoticeDays: assembly.props.callNoticeDays,
            agendaItemIds: assembly.props.agendaItemIds,
            title: assembly.props.title,
            callDate: assembly.props.callDate,
            callMethod: assembly.props.callMethod,
            callNoticeText: assembly.props.callNoticeText,
            convenerType: assembly.props.convenerType,
            convenerMemberId: assembly.props.convenerMemberId?.toString(),
            location: assembly.props.location,
            address: assembly.props.address,
            firstCallAt: assembly.props.firstCallAt,
            secondCallAt: assembly.props.secondCallAt,
            heldCallNumber: assembly.props.heldCallNumber,
            totalVotingMembers: assembly.props.totalVotingMembers,
            presentVotingMembers: assembly.props.presentVotingMembers,
            quorumMet: assembly.props.quorumMet,
            chairMemberId: assembly.props.chairMemberId?.toString(),
            secretaryMemberId: assembly.props.secretaryMemberId?.toString(),
            minutesContent: assembly.props.minutesContent
        };

        const domainEvents = assembly.domainEvents;

        await this.prisma.$transaction(async (tx: any) => {
            await tx.assembly.upsert({

                where: { id: data.id },
                update: data,
                create: data
            });

            for (const event of domainEvents) {
                const legalEvent = DomainEventMapper.toPersistence(event, assembly.props.associationId);
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

        assembly.clearEvents();
    }

}
