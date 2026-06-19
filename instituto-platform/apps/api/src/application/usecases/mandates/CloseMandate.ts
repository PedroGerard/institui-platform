import { IMandateRepository } from "../../../domain/repositories/Interfaces";
import { Mandate } from "../../../domain/entities/Mandate";
import { UniqueEntityID } from "../../../domain/shared/Entity";

interface CloseMandateDTO {
    mandateId: string;
    endDate?: Date;
}

export class CloseMandate {
    constructor(private mandateRepository: IMandateRepository) { }

    async execute(dto: CloseMandateDTO): Promise<Mandate> {
        const mandate = await this.mandateRepository.findById(new UniqueEntityID(dto.mandateId));

        if (!mandate) {
            throw new Error(`Mandate with ID ${dto.mandateId} not found`);
        }

        mandate.close(dto.endDate || new Date());
        await this.mandateRepository.save(mandate);

        return mandate;
    }
}
