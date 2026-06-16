import { PrismaClient } from "@prisma/client";
import { IAccountabilityRepository } from "../../domain/repositories/Interfaces";
import { AccountabilityProject, AccountabilityProjectProps, AccountabilityStatus, InstrumentType } from "../../domain/entities/AccountabilityProject";
import { UniqueEntityID } from "../../domain/shared/Entity";

export class PrismaAccountabilityRepository implements IAccountabilityRepository {
    constructor(private prisma: PrismaClient) { }

    async findById(id: UniqueEntityID): Promise<AccountabilityProject | null> {
        const raw = await this.prisma.accountabilityProject.findUnique({
            where: { id: id.toString() }
        });

        if (!raw) return null;

        return this.mapToDomain(raw);
    }

    async save(project: AccountabilityProject): Promise<void> {
        const data = {
            id: project.id.toString(),
            associationId: project.associationId.toString(),
            name: project.name,
            status: project.status as any,
            grantor: project.grantor,
            instrumentType: project.instrumentType as any,
            instrumentNumber: project.instrumentNumber,
            periodStart: project.periodStart,
            periodEnd: project.periodEnd,
            bankAccountId: project.bankAccountId,
            updatedAt: new Date()
        };

        await this.prisma.accountabilityProject.upsert({
            where: { id: project.id.toString() },
            update: data,
            create: {
                ...data,
                createdAt: new Date()
            }
        });
    }

    async listByAssociation(associationId: UniqueEntityID): Promise<AccountabilityProject[]> {
        const raw = await this.prisma.accountabilityProject.findMany({
            where: { associationId: associationId.toString() }
        });

        return raw.map(r => this.mapToDomain(r));
    }

    private mapToDomain(raw: any): AccountabilityProject {
        // Need to update Domain Entity to accept all these props or map partially
        const props: AccountabilityProjectProps = {
            associationId: new UniqueEntityID(raw.associationId),
            name: raw.name,
            status: raw.status as AccountabilityStatus,
            grantor: raw.grantor,
            instrumentType: raw.instrumentType as InstrumentType,
            periodStart: raw.periodStart,
            periodEnd: raw.periodEnd,
            bankAccountId: raw.bankAccountId,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        };
        return AccountabilityProject.create(props, new UniqueEntityID(raw.id));
    }
}
