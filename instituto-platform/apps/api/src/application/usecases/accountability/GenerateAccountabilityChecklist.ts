import { AccountabilityService } from "./AccountabilityService";

export class GenerateAccountabilityChecklist {
    constructor(private readonly service: AccountabilityService) { }

    async execute(projectId: string) {
        return this.service.generateChecklist(projectId);
    }
}
