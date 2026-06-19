import { AccountabilityService } from "./AccountabilityService";

export class SubmitAccountabilityProject {
    constructor(private readonly service: AccountabilityService) { }

    async execute(projectId: string, performedById?: string) {
        return this.service.submitProject(projectId, performedById);
    }
}
