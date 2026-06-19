
import { Entity, UniqueEntityID } from "./Entity";
import { DomainEvent } from "../events/DomainEvents";

export abstract class AggregateRoot<T> extends Entity<T> {
    private _domainEvents: DomainEvent[] = [];

    get domainEvents(): DomainEvent[] {
        return this._domainEvents;
    }

    protected addDomainEvent(domainEvent: DomainEvent): void {
        this._domainEvents.push(domainEvent);
    }

    public clearEvents(): void {
        this._domainEvents = [];
    }
}
