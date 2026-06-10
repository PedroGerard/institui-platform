
import { IAssemblyRepository, IDocumentRepository } from "../../domain/repositories/Interfaces";
import { LegalErrors, DomainError } from "../../domain/shared/LegalErrors";
import { UniqueEntityID } from "../../domain/shared/Entity";
import { Document, DocumentStatus } from "../../domain/entities/Document";
import { AssemblyStatus } from "../../domain/entities/Assembly";

interface RegisterMinutesRequest {
    assemblyId: string;
    content: string;
}

export class RegisterMinutesUseCase {
    private assemblyRepo: IAssemblyRepository;
    private documentRepo: IDocumentRepository;

    constructor(assemblyRepo: IAssemblyRepository, documentRepo: IDocumentRepository) {
        this.assemblyRepo = assemblyRepo;
        this.documentRepo = documentRepo;
    }

    async execute(req: RegisterMinutesRequest): Promise<void> {
        const assembly = await this.assemblyRepo.findById(new UniqueEntityID(req.assemblyId));

        if (!assembly) {
            throw new DomainError(LegalErrors.STATUTE_VIOLATION_ERROR, "Assembly not found.");
        }

        // Lock: Must be HELD before registering minutes
        if (assembly.props.status !== AssemblyStatus.HELD) {
            throw new DomainError(LegalErrors.LEGAL_COMPETENCE_ERROR, "Cannot register minutes for an assembly that has not been held (Status must be HELD).");
        }

        // Logic: Create Minutes Document
        // Ideally this should be a method on Assembly like `assembly.createMinutes(content)` but for now orchestrating here is fine for simplicity.
        const minutes = Document.create({
            associationId: assembly.props.associationId,
            title: `Ata da Assembleia - ${assembly.props.date.toLocaleDateString()}`,
            content: req.content,
            type: "MINUTES",
            status: DocumentStatus.REGISTERED, // Created directly as registered/final for this wizard
            originatingLegalActId: assembly.id
        });

        // Update Assembly Status
        // We probably need a method setMinutesRegistered() on Assembly, strictly speaking.
        // But assuming generic prop access or adding method:
        // assembly.props.status = AssemblyStatus.MINUTES_REGISTERED; 
        // Let's rely on a proper domain method to ensure encapsulation if we strictly follow DDD, 
        // but looking at Assembly.ts, props are accessible via getter but setter is private? 
        // Actually Assembly extends AggregateRoot<AssemblyProps>, usually props are protected/private.
        // Let's check Assembly.ts again or hack it.
        // Checking Assembly.ts... props seem to be accessible inside methods.
        // We should add `registerMinutes()` to Assembly entity.

        // Assuming I modify Assembly.ts in next step to add registerMinutes()
        assembly.setMinutesContent(req.content);
        assembly.registerMinutes();

        await this.documentRepo.save(minutes);
        await this.assemblyRepo.save(assembly);
    }
}
