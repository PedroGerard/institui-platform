
import { IAssemblyRepository } from "../../domain/repositories/Interfaces";
import { AssemblyService } from "../../domain/services/AssemblyService";
import { LegalErrors, DomainError } from "../../domain/shared/LegalErrors";
import { UniqueEntityID } from "../../domain/shared/Entity";
import { Quorum } from "../../domain/value-objects/Quorum";

interface HoldAssemblyRequest {
    assemblyId: string;
    heldAt?: Date;
    heldCallNumber?: number;
    totalVotingMembers?: number;
    presentVotingMembers?: number;
    chairMemberId?: string;
    secretaryMemberId?: string;
}

export class HoldAssemblyUseCase {
    private assemblyRepo: IAssemblyRepository;

    constructor(assemblyRepo: IAssemblyRepository) {
        this.assemblyRepo = assemblyRepo;
    }

    async execute(req: HoldAssemblyRequest): Promise<void> {
        const assembly = await this.assemblyRepo.findById(new UniqueEntityID(req.assemblyId));

        if (!assembly) {
            throw new DomainError(LegalErrors.STATUTE_VIOLATION_ERROR, "Assembly not found.");
        }

        const quorumWasProvided = req.totalVotingMembers !== undefined || req.presentVotingMembers !== undefined;
        const heldCallNumber = req.heldCallNumber ?? 2;
        const totalVotingMembers = req.totalVotingMembers ?? 0;
        const presentVotingMembers = req.presentVotingMembers ?? 0;

        if (quorumWasProvided) {
            AssemblyService.validateQuorum(
                assembly,
                new Quorum(presentVotingMembers, totalVotingMembers, 0),
                heldCallNumber
            );
        }

        assembly.hold({
            heldAt: req.heldAt,
            heldCallNumber,
            totalVotingMembers,
            presentVotingMembers,
            quorumMet: quorumWasProvided ? true : undefined,
            chairMemberId: req.chairMemberId ? new UniqueEntityID(req.chairMemberId) : undefined,
            secretaryMemberId: req.secretaryMemberId ? new UniqueEntityID(req.secretaryMemberId) : undefined
        });

        await this.assemblyRepo.save(assembly);
    }
}
