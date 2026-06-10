import { IMandateRepository } from "../../../domain/repositories/Interfaces";
import { Mandate } from "../../../domain/entities/Mandate";
import { UniqueEntityID } from "../../../domain/shared/Entity";

export class ListMandates {
    constructor(private mandateRepository: IMandateRepository) { }

    async execute(associationId?: string, onlyActive = false): Promise<Mandate[]> {
        return this.mandateRepository.listByAssociation(
            associationId ? new UniqueEntityID(associationId) : undefined,
            onlyActive
        );
    }
}
