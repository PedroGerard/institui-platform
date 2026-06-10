
import { AggregateRoot } from "../shared/AggregateRoot";
import { UniqueEntityID } from "../shared/Entity";
import { CNPJ } from "../value-objects/CNPJ";
import { Statute } from "./Statute"; // To be created

interface AssociationProps {
    name: string;
    cnpj: CNPJ;
    foundationDate: Date;
    activeStatuteId?: UniqueEntityID; // Reference to the active ruleset
    // TODO: Add Address, contact info, etc.
}

export class Association extends AggregateRoot<AssociationProps> {
    private constructor(props: AssociationProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: AssociationProps, id?: UniqueEntityID): Association {
        // Validation: Foundation date cannot be in future
        if (props.foundationDate > new Date()) {
            throw new Error("Foundation date cannot be in the future");
        }

        return new Association(props, id);
    }

    get name(): string { return this.props.name; }
    get cnpj(): CNPJ { return this.props.cnpj; }
    get activeStatuteId(): UniqueEntityID | undefined { return this.props.activeStatuteId; }

    public updateStatuteReference(statuteId: UniqueEntityID): void {
        this.props.activeStatuteId = statuteId;
        // Add domain event: AssociationStatuteUpdated
    }
}
