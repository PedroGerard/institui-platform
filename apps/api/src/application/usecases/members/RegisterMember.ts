import { IMemberRepository } from "../../../domain/repositories/Interfaces";
import { Member, MemberProps, MemberType, MemberStatus } from "../../../domain/entities/Member";
import { UniqueEntityID } from "../../../domain/shared/Entity";

interface RegisterMemberDTO {
    associationId: string;
    fullName: string;
    cpf: string;
    rg?: string;
    birthDate: Date; // or string and parse it
    email?: string;
    phone?: string;
    memberType: MemberType;
    admissionDate: Date;
}

export class RegisterMember {
    constructor(private memberRepository: IMemberRepository) { }

    async execute(dto: RegisterMemberDTO): Promise<Member> {
        const associationId = new UniqueEntityID(dto.associationId);
        const cpf = dto.cpf.replace(/\D/g, '');

        if (cpf.length !== 11) {
            throw new Error("CPF must contain 11 digits");
        }

        const existing = await this.memberRepository.findByCpf(associationId, cpf);
        if (existing) {
            throw new Error(`Member with CPF ${cpf} already exists in this association`);
        }

        const member = Member.create({
            associationId,
            fullName: dto.fullName,
            cpf,
            rg: dto.rg,
            birthDate: dto.birthDate,
            email: dto.email,
            phone: dto.phone,
            memberType: dto.memberType,
            status: MemberStatus.ACTIVE, // Default to ACTIVE
            admissionDate: dto.admissionDate,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await this.memberRepository.save(member);

        return member;
    }
}
