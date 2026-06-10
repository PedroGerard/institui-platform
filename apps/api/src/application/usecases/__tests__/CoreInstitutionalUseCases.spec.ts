import { describe, expect, it } from 'vitest';
import { CreateMandate } from '../mandates/CreateMandate.js';
import { RegisterMember } from '../members/RegisterMember.js';
import { GovernanceRole, Mandate } from '../../../domain/entities/Mandate.js';
import { Member, MemberStatus, MemberType } from '../../../domain/entities/Member.js';
import { IMandateRepository, IMemberRepository } from '../../../domain/repositories/Interfaces.js';
import { UniqueEntityID } from '../../../domain/shared/Entity.js';

class InMemoryMemberRepository implements IMemberRepository {
    public members: Member[] = [];

    async findById(id: UniqueEntityID): Promise<Member | null> {
        return this.members.find((member) => member.id.equals(id)) ?? null;
    }

    async findByCpf(associationId: UniqueEntityID, cpf: string): Promise<Member | null> {
        return this.members.find((member) => member.associationId.equals(associationId) && member.cpf === cpf) ?? null;
    }

    async save(member: Member): Promise<void> {
        const index = this.members.findIndex((item) => item.id.equals(member.id));
        if (index >= 0) {
            this.members[index] = member;
            return;
        }
        this.members.push(member);
    }

    async listByAssociation(associationId?: UniqueEntityID): Promise<Member[]> {
        return associationId
            ? this.members.filter((member) => member.associationId.equals(associationId))
            : this.members;
    }
}

class InMemoryMandateRepository implements IMandateRepository {
    public mandates: Mandate[] = [];

    async findById(id: UniqueEntityID): Promise<Mandate | null> {
        return this.mandates.find((mandate) => mandate.id.equals(id)) ?? null;
    }

    async findActiveByMemberId(memberId: UniqueEntityID): Promise<Mandate[]> {
        return this.mandates.filter((mandate) => mandate.memberId.equals(memberId) && mandate.isActive);
    }

    async findActiveByRole(associationId: UniqueEntityID, role: GovernanceRole): Promise<Mandate | null> {
        return this.mandates.find((mandate) => mandate.associationId.equals(associationId) && mandate.role === role && mandate.isActive) ?? null;
    }

    async listByAssociation(associationId?: UniqueEntityID, onlyActive = false): Promise<Mandate[]> {
        return this.mandates.filter((mandate) => {
            const sameAssociation = associationId ? mandate.associationId.equals(associationId) : true;
            const active = onlyActive ? mandate.isActive : true;
            return sameAssociation && active;
        });
    }

    async save(mandate: Mandate): Promise<void> {
        const index = this.mandates.findIndex((item) => item.id.equals(mandate.id));
        if (index >= 0) {
            this.mandates[index] = mandate;
            return;
        }
        this.mandates.push(mandate);
    }
}

describe('Core institutional use cases', () => {
    it('blocks duplicated CPF inside the same association', async () => {
        const memberRepo = new InMemoryMemberRepository();
        const useCase = new RegisterMember(memberRepo);
        const associationId = new UniqueEntityID().toString();

        await useCase.execute({
            associationId,
            fullName: 'Maria Silva',
            cpf: '123.456.789-01',
            birthDate: new Date('1988-01-01'),
            memberType: MemberType.EFFECTIVE,
            admissionDate: new Date('2026-01-10')
        });

        await expect(useCase.execute({
            associationId,
            fullName: 'Maria Silva II',
            cpf: '12345678901',
            birthDate: new Date('1988-01-01'),
            memberType: MemberType.EFFECTIVE,
            admissionDate: new Date('2026-01-10')
        })).rejects.toThrow('already exists');
    });

    it('blocks mandate creation for an inactive member', async () => {
        const associationId = new UniqueEntityID();
        const memberRepo = new InMemoryMemberRepository();
        const mandateRepo = new InMemoryMandateRepository();
        const member = Member.create({
            associationId,
            fullName: 'Joao Souza',
            cpf: '11122233344',
            birthDate: new Date('1980-01-01'),
            memberType: MemberType.EFFECTIVE,
            status: MemberStatus.INACTIVE,
            admissionDate: new Date('2025-01-01')
        });

        await memberRepo.save(member);
        const useCase = new CreateMandate(mandateRepo, memberRepo);

        await expect(useCase.execute({
            associationId: associationId.toString(),
            memberId: member.id.toString(),
            role: GovernanceRole.PRESIDENT,
            startDate: new Date('2026-01-01')
        })).rejects.toThrow('not active');
    });

    it('blocks two active presidents in the same association', async () => {
        const associationId = new UniqueEntityID();
        const memberRepo = new InMemoryMemberRepository();
        const mandateRepo = new InMemoryMandateRepository();
        const firstMember = Member.create({
            associationId,
            fullName: 'Ana Presidente',
            cpf: '11122233344',
            birthDate: new Date('1980-01-01'),
            memberType: MemberType.EFFECTIVE,
            status: MemberStatus.ACTIVE,
            admissionDate: new Date('2025-01-01')
        });
        const secondMember = Member.create({
            associationId,
            fullName: 'Bia Presidente',
            cpf: '55566677788',
            birthDate: new Date('1982-01-01'),
            memberType: MemberType.EFFECTIVE,
            status: MemberStatus.ACTIVE,
            admissionDate: new Date('2025-01-01')
        });

        await memberRepo.save(firstMember);
        await memberRepo.save(secondMember);

        const useCase = new CreateMandate(mandateRepo, memberRepo);
        await useCase.execute({
            associationId: associationId.toString(),
            memberId: firstMember.id.toString(),
            role: GovernanceRole.PRESIDENT,
            startDate: new Date('2026-01-01')
        });

        await expect(useCase.execute({
            associationId: associationId.toString(),
            memberId: secondMember.id.toString(),
            role: GovernanceRole.PRESIDENT,
            startDate: new Date('2026-02-01')
        })).rejects.toThrow('active mandate');
    });

    it('blocks overlapping active mandates for the same member through the use case', async () => {
        const associationId = new UniqueEntityID();
        const memberRepo = new InMemoryMemberRepository();
        const mandateRepo = new InMemoryMandateRepository();
        const member = Member.create({
            associationId,
            fullName: 'Carlos Diretor',
            cpf: '99988877766',
            birthDate: new Date('1985-01-01'),
            memberType: MemberType.EFFECTIVE,
            status: MemberStatus.ACTIVE,
            admissionDate: new Date('2025-01-01')
        });

        await memberRepo.save(member);

        const useCase = new CreateMandate(mandateRepo, memberRepo);
        await useCase.execute({
            associationId: associationId.toString(),
            memberId: member.id.toString(),
            role: GovernanceRole.PRESIDENT,
            startDate: new Date('2026-01-01')
        });

        await expect(useCase.execute({
            associationId: associationId.toString(),
            memberId: member.id.toString(),
            role: GovernanceRole.TREASURER,
            startDate: new Date('2026-02-01')
        })).rejects.toThrow('Member already holds a mandate');
    });
});
