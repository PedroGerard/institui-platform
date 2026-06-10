import { AccountabilityService, UploadAccountabilityDocumentInput } from "./AccountabilityService";

export class UploadAccountabilityDocument {
    constructor(private readonly service: AccountabilityService) { }

    async execute(projectId: string, input: UploadAccountabilityDocumentInput) {
        return this.service.uploadDocument(projectId, input);
    }
}
