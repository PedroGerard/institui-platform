import { AccountabilityService } from "./AccountabilityService";

export class GetAccountabilityProject {
    constructor(private readonly service: AccountabilityService) { }

    async execute(id: string) {
        return this.service.getProject(id);
    }
}
