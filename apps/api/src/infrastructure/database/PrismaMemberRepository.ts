import { PrismaClient } from "@prisma/client";
import { IMemberRepository } from "../../domain/repositories/Interfaces";
import { Member, MemberProps, MemberType, MemberStatus } from "../../domain/entities/Member";
import { UniqueEntityID } from "../../domain/shared/Entity";

export class PrismaMemberRepository implements IMemberRepository {
    constructor(private prisma: PrismaClient) { }

    async findById(id: UniqueEntityID): Promise<Member | null> {
        const data = await this.prisma.member.findUnique({
            where: { id: id.toString() }
        });

        if (!data) return null;

        return this.mapToDomain(data);
    }

    async findByCpf(associationId: UniqueEntityID, cpf: string): Promise<Member | null> {
        const data = await this.prisma.member.findFirst({
            where: {
                associationId: associationId.toString(),
                cpf
            }
        });

        if (!data) return null;

        return this.mapToDomain(data);
    }

    async save(member: Member): Promise<void> {
        const data = {
            id: member.id.toString(),
            associationId: member.associationId.toString(),
            fullName: member.fullName,
            cpf: member.cpf,
            rg: member.rg,
            birthDate: member.birthDate,
            email: member.email,
            phone: member.phone,
            memberType: member.memberType as any, // Cast to match Prisma Enum if types diff slightly
            status: member.status as any,
            admissionDate: member.admissionDate,
            resignationDate: member.resignationDate,
            updatedAt: member.updatedAt || new Date()
        };

        await this.prisma.member.upsert({
            where: { id: member.id.toString() },
            update: data,
            create: {
                ...data,
                createdAt: member.createdAt || new Date()
            }
        });
    }

    async listByAssociation(associationId?: UniqueEntityID): Promise<Member[]> {
        const members = await this.prisma.member.findMany({
            where: associationId ? { associationId: associationId.toString() } : undefined,
            orderBy: [
                { fullName: 'asc' }
            ]
        });
        return members.map(m => this.mapToDomain(m));
    }

    private mapToDomain(raw: any): Member {
        const memberProps: MemberProps = {
            associationId: new UniqueEntityID(raw.associationId),
            fullName: raw.fullName,
            cpf: raw.cpf,
            rg: raw.rg,
            birthDate: raw.birthDate,
            email: raw.email,
            phone: raw.phone,
            memberType: raw.memberType as MemberType,
            status: raw.status as MemberStatus,
            admissionDate: raw.admissionDate,
            resignationDate: raw.resignationDate,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        };

        return Member.create(memberProps, new UniqueEntityID(raw.id));
    }
}
