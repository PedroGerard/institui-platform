
import { Entity, UniqueEntityID } from "../shared/Entity";

export interface LegalEventProps {
    type: string;
    timestamp: Date;
    actorId?: UniqueEntityID;
    associationId: UniqueEntityID;
    payload: unknown;
}

export class LegalEvent extends Entity<LegalEventProps> {
    private constructor(props: LegalEventProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: LegalEventProps, id?: UniqueEntityID): LegalEvent {
        return new LegalEvent(props, id);
    }
}
