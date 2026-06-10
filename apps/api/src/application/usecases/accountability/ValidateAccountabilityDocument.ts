import { AccountabilityService } from "./AccountabilityService";

export class ValidateAccountabilityDocument {
    constructor(private readonly service: AccountabilityService) { }

    async execute(documentId: string, validated: boolean, performedById?: string) {
        return this.service.validateDocument(documentId, validated, performedById);
    }
}
