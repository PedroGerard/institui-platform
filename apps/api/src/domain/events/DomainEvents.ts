
import { UniqueEntityID } from "../shared/Entity";

export interface DomainEvent {
    dateTimeOccurred: Date;
    getAggregateId(): UniqueEntityID;
}

export class AssemblyHeld implements DomainEvent {
    public dateTimeOccurred: Date;
    public assemblyId: UniqueEntityID;

    constructor(assemblyId: UniqueEntityID) {
        this.dateTimeOccurred = new Date();
        this.assemblyId = assemblyId;
    }

    getAggregateId(): UniqueEntityID {
        return this.assemblyId;
    }
}

export class StatuteChanged implements DomainEvent {
    public dateTimeOccurred: Date;
    public statuteId: UniqueEntityID;
    public newVersionId: UniqueEntityID;

    constructor(statuteId: UniqueEntityID, newVersionId: UniqueEntityID) {
        this.dateTimeOccurred = new Date();
        this.statuteId = statuteId;
        this.newVersionId = newVersionId;
    }

    getAggregateId(): UniqueEntityID {
        return this.statuteId;
    }
}

export class MandateStarted implements DomainEvent {
    public dateTimeOccurred: Date;
    public mandateId: UniqueEntityID;

    constructor(mandateId: UniqueEntityID) {
        this.dateTimeOccurred = new Date();
        this.mandateId = mandateId;
    }

    getAggregateId(): UniqueEntityID {
        return this.mandateId;
    }
}
