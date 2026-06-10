import { PrismaClient } from "@prisma/client";
import { IMandateRepository } from "../../domain/repositories/Interfaces";
import { Mandate, MandateProps, GovernanceRole } from "../../domain/entities/Mandate";
import { UniqueEntityID } from "../../domain/shared/Entity";

export class PrismaMandateRepository implements IMandateRepository {
    constructor(private prisma: PrismaClient) { }

    async findById(id: UniqueEntityID): Promise<Mandate | null> {
        const data = await this.prisma.mandate.findUnique({
            where: { id: id.toString() }
        });

        if (!data) return null;

        return this.mapToDomain(data);
    }

    async findActiveByMemberId(memberId: UniqueEntityID): Promise<Mandate[]> {
        const data = await this.prisma.mandate.findMany({
            where: {
                memberId: memberId.toString(),
                isActive: true
            }
        });

        return data.map(m => this.mapToDomain(m));
    }

    async findActiveByRole(associationId: UniqueEntityID, role: GovernanceRole): Promise<Mandate | null> {
        const data = await this.prisma.mandate.findFirst({
            where: {
                associationId: associationId.toString(),
                role: role, // Prisma enum
                isActive: true
            }
        });

        if (!data) return null;
        return this.mapToDomain(data);
    }

    async save(mandate: Mandate): Promise<void> {
        const data = {
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
            updatedAt: mandate.updatedAt || new Date()
        };

        await this.prisma.mandate.upsert({
            where: { id: mandate.id.toString() },
            update: data,
            create: {
                ...data,
                createdAt: mandate.createdAt || new Date()
            }
        });
    }

    async listByAssociation(associationId?: UniqueEntityID, onlyActive = false): Promise<Mandate[]> {
        const data = await this.prisma.mandate.findMany({
            where: {
                ...(associationId ? { associationId: associationId.toString() } : {}),
                ...(onlyActive ? { isActive: true } : {})
            },
            orderBy: [
                { isActive: 'desc' },
                { startDate: 'desc' }
            ]
        });

        return data.map(m => this.mapToDomain(m));
    }

    private mapToDomain(raw: any): Mandate {
        const props: MandateProps = {
            associationId: new UniqueEntityID(raw.associationId),
            memberId: new UniqueEntityID(raw.memberId),
            governanceBodyId: raw.governanceBodyId ? new UniqueEntityID(raw.governanceBodyId) : undefined,
            electionId: raw.electionId ? new UniqueEntityID(raw.electionId) : undefined,
            sourceAssemblyId: raw.sourceAssemblyId ? new UniqueEntityID(raw.sourceAssemblyId) : undefined,
            role: raw.role as GovernanceRole,
            roleName: raw.roleName,
            seatName: raw.seatName,
            startDate: raw.startDate,
            endDate: raw.endDate,
            isActive: raw.isActive,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        };

        return Mandate.create(props, new UniqueEntityID(raw.id));
    }
}
