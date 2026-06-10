import { AccountabilityService, RegisterFiscalOpinionInput } from "./AccountabilityService";

export class RegisterFiscalOpinion {
    constructor(private readonly service: AccountabilityService) { }

    async execute(projectId: string, input: RegisterFiscalOpinionInput) {
        return this.service.registerFiscalOpinion(projectId, input);
    }
}
