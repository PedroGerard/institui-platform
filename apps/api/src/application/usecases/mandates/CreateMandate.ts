import { IMandateRepository, IMemberRepository } from "../../../domain/repositories/Interfaces";
import { GovernanceRole, Mandate } from "../../../domain/entities/Mandate";
import { MandateService } from "../../../domain/services/MandateService";
import { UniqueEntityID } from "../../../domain/shared/Entity";

interface CreateMandateDTO {
    associationId: string;
    memberId: string;
    governanceBodyId?: string;
    electionId?: string;
    sourceAssemblyId?: string;
    role: GovernanceRole;
    roleName?: string;
    seatName?: string;
    startDate: Date;
    endDate?: Date;
}

export class CreateMandate {
    constructor(
        private mandateRepository: IMandateRepository,
        private memberRepository: IMemberRepository
    ) { }

    async execute(dto: CreateMandateDTO): Promise<Mandate> {
        const associationId = new UniqueEntityID(dto.associationId);
        const member = await this.memberRepository.findById(new UniqueEntityID(dto.memberId));

        if (!member) {
            throw new Error(`Member with ID ${dto.memberId} not found`);
        }

        if (!member.associationId.equals(associationId)) {
            throw new Error("Member does not belong to this association");
        }

        if (!member.isActive()) {
            throw new Error(`Member is not active (Status: ${member.status})`);
        }

        const memberId = new UniqueEntityID(dto.memberId);
        const activeAssociationMandates = await this.mandateRepository.listByAssociation(associationId, true);
        const activeMemberMandates = await this.mandateRepository.findActiveByMemberId(memberId);
        const existingMandates = [...activeAssociationMandates];

        for (const activeMemberMandate of activeMemberMandates) {
            if (!existingMandates.some((mandate) => mandate.id.equals(activeMemberMandate.id))) {
                existingMandates.push(activeMemberMandate);
            }
        }

        const mandate = Mandate.create({
            associationId,
            memberId,
            governanceBodyId: dto.governanceBodyId ? new UniqueEntityID(dto.governanceBodyId) : undefined,
            electionId: dto.electionId ? new UniqueEntityID(dto.electionId) : undefined,
            sourceAssemblyId: dto.sourceAssemblyId ? new UniqueEntityID(dto.sourceAssemblyId) : undefined,
            role: dto.role,
            roleName: dto.roleName,
            seatName: dto.seatName,
            startDate: dto.startDate,
            endDate: dto.endDate,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        MandateService.validateNewMandate(mandate, existingMandates);
        await this.mandateRepository.save(mandate);

        return mandate;
    }
}
