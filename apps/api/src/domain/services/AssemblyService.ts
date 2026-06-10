
import { Assembly, AssemblyType, AssemblyStatus } from "../entities/Assembly";
import { Statute } from "../entities/Statute";
import { Quorum } from "../value-objects/Quorum";
import { LegalErrors, DomainError } from "../shared/LegalErrors";

export class AssemblyService {

    public static validateCall(assembly: Assembly, statute: Statute): void {
        // Rule 1: Call Notice Days (Source: Statute)
        const daysDiff = (assembly.props.scheduledDate.getTime() - assembly.props.date.getTime()) / (1000 * 3600 * 24);
        const minDays = statute.getMinimumCallNotice(assembly.type);

        if (daysDiff < minDays) {
            throw new DomainError(LegalErrors.LEGAL_COMPETENCE_ERROR, `Insufficient notice. Required ${minDays} days for ${assembly.type}.`);
        }

        // Rule 2: Competence Check (Source: Statute)
        AssemblyService.validateAgendaCompetence(assembly.type, assembly.props.agendaItemIds, statute);
    }

    public static validateAgendaCompetence(assemblyType: AssemblyType, agendaTopics: string[], statute: Statute): void {
        // Get what is exclusive to the OTHER type
        const otherType = assemblyType === AssemblyType.AGO ? AssemblyType.AGE : AssemblyType.AGO;
        const prohibitedTopics = statute.getExclusiveAgenda(otherType);

        for (const topic of agendaTopics) {
            if (prohibitedTopics.includes(topic)) {
                throw new DomainError(LegalErrors.LEGAL_COMPETENCE_ERROR, `${assemblyType} cannot deliberate on ${topic}. This topic is exclusive to ${otherType}.`);
            }
        }
    }

    public static validateQuorum(assembly: Assembly, quorum: Quorum, callNumber: number): void {
        if (quorum.votingMembers <= 0) {
            throw new DomainError(LegalErrors.QUORUM_ERROR, "No voting members available for quorum calculation.");
        }

        if (callNumber === 1) {
            const requiredPresence = Math.floor(quorum.votingMembers / 2) + 1;

            if (quorum.presentMembers < requiredPresence) {
                throw new DomainError(LegalErrors.QUORUM_ERROR, `Insufficient quorum for first call. Required absolute majority (${requiredPresence}).`);
            }
            return;
        }

        if (callNumber === 2) {
            if (quorum.presentMembers < 1) {
                throw new DomainError(LegalErrors.QUORUM_ERROR, "Second call requires at least one voting member present.");
            }
            return;
        }

        throw new DomainError(LegalErrors.QUORUM_ERROR, "Invalid call number.");
    }

    public static calculateSpecialApproval(votesFor: number, presentMembers: number): boolean {
        if (presentMembers <= 0) return false;
        return votesFor >= Math.ceil((presentMembers * 2) / 3);
    }
}
