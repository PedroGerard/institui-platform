import { AccountabilityService, ListAccountabilityProjectsFilters } from "./AccountabilityService";

export class ListAccountabilityProjects {
    constructor(private readonly service: AccountabilityService) { }

    async execute(filters?: ListAccountabilityProjectsFilters) {
        return this.service.listProjects(filters);
    }
}
