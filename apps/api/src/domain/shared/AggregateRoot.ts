
import { Entity, UniqueEntityID } from "./Entity";

export abstract class AggregateRoot<T> extends Entity<T> {
    private _domainEvents: any[] = []; // Type strictly later

    get domainEvents(): any[] {
        return this._domainEvents;
    }

    protected addDomainEvent(domainEvent: any): void {
        this._domainEvents.push(domainEvent);
        // Log intent to dispatch
    }

    public clearEvents(): void {
        this._domainEvents = [];
    }
}
