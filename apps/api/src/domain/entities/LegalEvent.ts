
import { Entity, UniqueEntityID } from "../shared/Entity";

export interface LegalEventProps {
    type: string; // e.g. "AssemblyHeld", "StatuteChanged"
    timestamp: Date;
    actorId?: UniqueEntityID; // Who caused it
    associationId: UniqueEntityID;
    payload: any; // JSON detail
}

export class LegalEvent extends Entity<LegalEventProps> {
    private constructor(props: LegalEventProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: LegalEventProps, id?: UniqueEntityID): LegalEvent {
        return new LegalEvent(props, id);
    }
}
