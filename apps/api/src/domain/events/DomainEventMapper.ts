
import { DomainEvent } from "./DomainEvents.js";
import { UniqueEntityID } from "../shared/Entity.js";
import { LegalEvent } from "../entities/LegalEvent.js";

export class DomainEventMapper {
    static toPersistence(event: DomainEvent, associationId: UniqueEntityID): LegalEvent {
        const eventName = event.constructor.name;
        const aggregateId = event.getAggregateId();

        const payload = { ...event } as Record<string, unknown>;
        delete payload.dateTimeOccurred;

        return LegalEvent.create({
            type: eventName,
            timestamp: event.dateTimeOccurred,
            associationId: associationId,
            actorId: undefined,
            payload: payload
        });
    }
}
