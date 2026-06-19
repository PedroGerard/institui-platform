
import { AggregateRoot } from "../shared/AggregateRoot";
import { UniqueEntityID } from "../shared/Entity";
import { LegalErrors, DomainError } from "../shared/LegalErrors";
import { AssemblyHeld } from "../events/DomainEvents.js";


export enum AssemblyType {
    AGO = "AGO",
    AGE = "AGE"
}

export enum AssemblyStatus {
    CALLED = "CALLED",
    HELD = "HELD",
    CANCELED = "CANCELED",
    MINUTES_REGISTERED = "MINUTES_REGISTERED"
}

export interface AssemblyProps {
    associationId: UniqueEntityID;
    type: AssemblyType;
    date: Date;
    scheduledDate: Date; // The date it was planned for
    status: AssemblyStatus;
    agendaItemIds: string[]; // List of topics
    callNoticeDays: number; // How many days in advance it was called
    title?: string;
    callDate?: Date;
    callMethod?: string;
    callNoticeText?: string;
    convenerType?: string;
    convenerMemberId?: UniqueEntityID;
    location?: string;
    address?: string;
    firstCallAt?: Date;
    secondCallAt?: Date;
    heldCallNumber?: number;
    totalVotingMembers?: number;
    presentVotingMembers?: number;
    quorumMet?: boolean;
    chairMemberId?: UniqueEntityID;
    secretaryMemberId?: UniqueEntityID;
    minutesContent?: string;
}

export class Assembly extends AggregateRoot<AssemblyProps> {
    private constructor(props: AssemblyProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: AssemblyProps, id?: UniqueEntityID): Assembly {
        // Basic invariant: Date must be future when creating a NEW call? 
        // Not necessarily if we are loading from DB.
        // Domain Service will check creation logic.
        return new Assembly(props, id);
    }

    get type(): AssemblyType { return this.props.type; }
    get status(): AssemblyStatus { return this.props.status; }
    get associationId(): UniqueEntityID { return this.props.associationId; }
    get date(): Date { return this.props.date; }
    get agendaItemIds(): string[] { return this.props.agendaItemIds; }
    get scheduledDate(): Date { return this.props.scheduledDate; }
    get callNoticeDays(): number { return this.props.callNoticeDays; }

    public hold(input?: {
        heldAt?: Date;
        heldCallNumber?: number;
        totalVotingMembers?: number;
        presentVotingMembers?: number;
        quorumMet?: boolean;
        chairMemberId?: UniqueEntityID;
        secretaryMemberId?: UniqueEntityID;
    }): void {
        if (this.props.status !== AssemblyStatus.CALLED) {
            throw new DomainError(LegalErrors.ASSEMBLY_ALREADY_HELD, "Assembly already held or canceled.");
        }

        this.props.status = AssemblyStatus.HELD;
        this.props.date = input?.heldAt || new Date();
        this.props.heldCallNumber = input?.heldCallNumber;
        this.props.totalVotingMembers = input?.totalVotingMembers;
        this.props.presentVotingMembers = input?.presentVotingMembers;
        this.props.quorumMet = input?.quorumMet;
        this.props.chairMemberId = input?.chairMemberId;
        this.props.secretaryMemberId = input?.secretaryMemberId;
        this.addDomainEvent(new AssemblyHeld(this.id));



    }

    public registerMinutes(): void {
        if (this.props.status !== AssemblyStatus.HELD) {
            throw new DomainError(LegalErrors.LEGAL_COMPETENCE_ERROR, "Cannot register minutes. Assembly not held.");
        }
        this.props.status = AssemblyStatus.MINUTES_REGISTERED;
        // Could emit 'MinutesRegistered' event here if we had it defined
    }

    public setMinutesContent(content: string): void {
        this.props.minutesContent = content;
    }
}


