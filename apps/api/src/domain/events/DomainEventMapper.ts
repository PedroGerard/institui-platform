
import { DomainEvent } from "./DomainEvents.js";
import { UniqueEntityID } from "../shared/Entity.js";
import { LegalEvent } from "../entities/LegalEvent.js";

export class DomainEventMapper {
    static toPersistence(event: DomainEvent, associationId: UniqueEntityID): LegalEvent {
        const eventName = event.constructor.name;
        const aggregateId = event.getAggregateId();

        // Extract payload (everything except standard props)
        const payload: any = { ...event };
        delete payload.dateTimeOccurred;
        // We can leave other props as payload

        return LegalEvent.create({
            type: eventName,
            timestamp: event.dateTimeOccurred,
            associationId: associationId,
            actorId: undefined,
            payload: payload
        });
    }
}
