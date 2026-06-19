
import { Entity, UniqueEntityID } from "../shared/Entity";
import { LegalErrors, DomainError } from "../shared/LegalErrors";

export enum DocumentStatus {
    DRAFT = "DRAFT",
    APPROVED = "APPROVED",
    REGISTERED = "REGISTERED"
}

export interface DocumentProps {
    title: string;
    content: string; // Content or S3 URL
    type: string; // "Minutes", "Edict"
    status: DocumentStatus;
    associationId: UniqueEntityID;
    originatingLegalActId?: UniqueEntityID; // Assembly or Mandate ID
    md5Hash?: string; // Integrity check
}

export class Document extends Entity<DocumentProps> {
    private constructor(props: DocumentProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: DocumentProps, id?: UniqueEntityID): Document {
        return new Document(props, id);
    }

    public updateContent(newContent: string): void {
        if (this.props.status === DocumentStatus.REGISTERED) {
            throw new DomainError(LegalErrors.IMMUTABILITY_VIOLATION_ERROR, "Cannot edit a registered document.");
        }
        this.props.content = newContent;
    }

    public register(): void {
        if (this.props.status === DocumentStatus.REGISTERED) {
            return; // Idempotent
        }
        this.props.status = DocumentStatus.REGISTERED;
        // Lock hash
    }
}
