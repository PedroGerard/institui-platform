
import { Entity, UniqueEntityID } from "../shared/Entity";
import { AggregateRoot } from "../shared/AggregateRoot";
import { LegalErrors, DomainError } from "../shared/LegalErrors";

export interface StatuteVersionProps {
    versionNumber: number;
    approvalDate: Date;
    registrationDate?: Date; // If present, it's immutable
    content: string; // JSON or content reference
    originatingAssemblyId: UniqueEntityID; // The AGE that approved it
    isConsolidated: boolean;
}

export class StatuteVersion extends Entity<StatuteVersionProps> {
    private constructor(props: StatuteVersionProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: StatuteVersionProps, id?: UniqueEntityID): StatuteVersion {
        return new StatuteVersion(props, id);
    }

    get isRegistered(): boolean {
        return !!this.props.registrationDate;
    }

    public markAsRegistered(date: Date): void {
        if (this.isRegistered) {
            throw new DomainError(LegalErrors.IMMUTABILITY_VIOLATION_ERROR, "Cannot re-register a statute version.");
        }
        this.props.registrationDate = date;
    }
}

export interface StatuteProps {
    associationId: UniqueEntityID;
    versions: StatuteVersion[];
    activeVersionId?: UniqueEntityID;
}

export class Statute extends AggregateRoot<StatuteProps> {
    private constructor(props: StatuteProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: StatuteProps, id?: UniqueEntityID): Statute {
        return new Statute(props, id);
    }

    public addVersion(version: StatuteVersion): void {
        const existing = this.props.versions.find(v => v.props.versionNumber === version.props.versionNumber);
        if (existing) {
            throw new Error("Version number already exists");
        }
        this.props.versions.push(version);
    }

    public activateVersion(versionId: UniqueEntityID): void {
        const version = this.props.versions.find(v => v.id.equals(versionId));
        if (!version) {
            throw new DomainError(LegalErrors.STATUTE_VIOLATION_ERROR, "Version not found in this statute history");
        }
        if (!version.isRegistered) {
            // In Brazil, a statute is only effectively active for 3rd parties after registration (averbação).
            // Internal force exists from approval, but we emulate "Legal Governance".
            // We might allow activation if approved, but warn about pending registration.
        }
        this.props.activeVersionId = versionId;
    }

    // --- Rule Enforcements (Source of Truth) ---

    get activeVersion(): StatuteVersion | undefined {
        return this.props.versions.find(v => v.id.equals(this.props.activeVersionId));
    }

    public getMinimumCallNotice(assemblyType: "AGO" | "AGE"): number {

        // In a full dynamic system, this would read from this.activeVersion.content (if parsed)
        // Instituto Incentive: edital com antecedencia minima de 8 dias.
        return 8;
    }

    public getExclusiveAgenda(assemblyType: "AGO" | "AGE"): string[] {
        if (assemblyType === "AGO") {
            // AGO typically typically deals with Accounts and Elections (if cyclical)
            return ["ACCOUNTS_APPROVAL", "ELECTION_BOARD", "ELECTION_FISCAL"];
        }
        if (assemblyType === "AGE") {
            // AGE is exclusive for changes, dissolutions, exclusions
            return ["STATUTE_CHANGE", "DISSOLUTION", "MEMBER_EXCLUSION", "REAL_ESTATE_SALE"];
        }
        return [];
    }

    public requiresConsolidationFor(topic: string): boolean {
        const structuralTopics = ["STATUTE_CHANGE", "DISSOLUTION"];
        return structuralTopics.includes(topic);
    }
}

