import { AccountabilityService, CreateAccountabilityProjectInput } from "./AccountabilityService";

export class CreateAccountabilityProject {
    constructor(private readonly service: AccountabilityService) { }

    async execute(input: CreateAccountabilityProjectInput) {
        return this.service.createProject(input);
    }
}
