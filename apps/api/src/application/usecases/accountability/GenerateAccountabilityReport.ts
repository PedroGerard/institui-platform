import { ReportType } from "@prisma/client";
import { AccountabilityService } from "./AccountabilityService";

export class GenerateAccountabilityReport {
    constructor(private readonly service: AccountabilityService) { }

    async execute(projectId: string, type: ReportType, performedById?: string) {
        return this.service.generateReport(projectId, type, performedById);
    }
}
