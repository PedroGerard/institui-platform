
import { Entity, UniqueEntityID } from "../shared/Entity";
import { CNPJ } from "../value-objects/CNPJ";
import { DateRange } from "../value-objects/DateRange";

export interface PartnershipProps {
    associationId: UniqueEntityID;
    partnerName: string;
    partnerCnpj: CNPJ;
    object: string;
    value: number; // In cents
    term: DateRange;
    processNumber: string;
}

export class Partnership extends Entity<PartnershipProps> {
    private constructor(props: PartnershipProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: PartnershipProps, id?: UniqueEntityID): Partnership {
        return new Partnership(props, id);
    }
}
