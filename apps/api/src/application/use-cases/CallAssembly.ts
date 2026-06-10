
import { Assembly, AssemblyType, AssemblyStatus } from "../../domain/entities/Assembly.js";
import { AssemblyService } from "../../domain/services/AssemblyService.js";
import { IAssemblyRepository, IAssociationRepository, IStatuteRepository } from "../../domain/repositories/Interfaces.js";
import { UniqueEntityID } from "../../domain/shared/Entity.js";
import { LegalErrors, DomainError } from "../../domain/shared/LegalErrors.js";

interface CallAssemblyRequest {
    associationId: string;
    type: AssemblyType;
    date: Date; // Scheduled date
    callNoticeDate: Date; // Today?
    agenda: string[];
    title?: string;
    callMethod?: string;
    callNoticeText?: string;
    convenerType?: string;
    convenerMemberId?: string;
    location?: string;
    address?: string;
    firstCallAt?: Date;
    secondCallAt?: Date;
}

export class CallAssemblyUseCase {
    private associationRepo: IAssociationRepository;
    private assemblyRepo: IAssemblyRepository;
    private statuteRepo: IStatuteRepository;

    constructor(
        associationRepo: IAssociationRepository,
        assemblyRepo: IAssemblyRepository,
        statuteRepo: IStatuteRepository
    ) {
        this.associationRepo = associationRepo;
        this.assemblyRepo = assemblyRepo;
        this.statuteRepo = statuteRepo;
    }

    async execute(request: CallAssemblyRequest): Promise<Assembly> {
        const assocId = new UniqueEntityID(request.associationId);
        const association = await this.associationRepo.findById(assocId);

        if (!association) {
            throw new DomainError(LegalErrors.ASSOCIATION_NOT_FOUND, "Association not found");
        }

        const statute = await this.statuteRepo.findByAssociationId(assocId);
        if (!statute) {
            throw new DomainError(LegalErrors.STATUTE_VIOLATION_ERROR, "No active statute found for this association.");
        }

        // Idempotency Check
        const existingAssembly = await this.assemblyRepo.findByScheduledDate(assocId, request.type, request.date);
        if (existingAssembly) {
            throw new DomainError(LegalErrors.LEGAL_DUPLICATE_ACT_ERROR, "An assembly of this type is already scheduled for this date/time.");
        }

        // Calculate call notice days

        const diffTime = Math.abs(request.date.getTime() - request.callNoticeDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const assembly = Assembly.create({
            associationId: assocId,
            type: request.type,
            date: request.date, // This is the scheduled date
            scheduledDate: request.date,
            status: AssemblyStatus.CALLED,
            agendaItemIds: request.agenda,
            callNoticeDays: diffDays,
            title: request.title,
            callDate: request.callNoticeDate,
            callMethod: request.callMethod,
            callNoticeText: request.callNoticeText,
            convenerType: request.convenerType,
            convenerMemberId: request.convenerMemberId ? new UniqueEntityID(request.convenerMemberId) : undefined,
            location: request.location,
            address: request.address,
            firstCallAt: request.firstCallAt,
            secondCallAt: request.secondCallAt
        });

        // Validate Competence (Statute-driven)
        AssemblyService.validateAgendaCompetence(request.type, request.agenda, statute);

        // Validate Call Notice (Statute-driven)
        AssemblyService.validateCall(assembly, statute);

        await this.assemblyRepo.save(assembly);
        return assembly;
    }
}
