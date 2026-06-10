
import { PrismaClient } from "@prisma/client";
import { Association } from "../../domain/entities/Association";
import { UniqueEntityID } from "../../domain/shared/Entity";
import { IAssociationRepository } from "../../domain/repositories/Interfaces";
import { CNPJ } from "../../domain/value-objects/CNPJ";

export class PrismaAssociationRepository implements IAssociationRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async findById(id: UniqueEntityID): Promise<Association | null> {
        const raw = await this.prisma.association.findUnique({
            where: { id: id.toString() }
        });

        if (!raw) return null;

        // TODO: Map Address or real props
        // We recreate via 'create' or a public mapping method
        return Association.create({
            name: raw.name,
            cnpj: CNPJ.create(raw.cnpj),
            foundationDate: raw.foundationDate,
            activeStatuteId: raw.activeStatuteId ? new UniqueEntityID(raw.activeStatuteId) : undefined
        }, new UniqueEntityID(raw.id));
    }

    async save(association: Association): Promise<void> {
        await this.prisma.association.upsert({
            where: { id: association.id.toString() },
            update: {
                activeStatuteId: association.activeStatuteId?.toString()
            },
            create: {
                id: association.id.toString(),
                name: association.name,
                cnpj: association.cnpj.value,
                foundationDate: association.props.foundationDate,
                activeStatuteId: association.activeStatuteId?.toString()
            }
        });
    }
}
