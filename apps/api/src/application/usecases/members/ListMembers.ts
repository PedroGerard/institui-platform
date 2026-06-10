import { IMemberRepository } from "../../../domain/repositories/Interfaces";
import { Member } from "../../../domain/entities/Member";
import { UniqueEntityID } from "../../../domain/shared/Entity";

export class ListMembers {
    constructor(private memberRepository: IMemberRepository) { }

    async execute(associationId?: string): Promise<Member[]> {
        return await this.memberRepository.listByAssociation(
            associationId ? new UniqueEntityID(associationId) : undefined
        );
    }
}
