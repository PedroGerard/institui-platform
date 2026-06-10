import { Entity, UniqueEntityID } from "../shared/Entity";

export enum AccountabilityStatus {
    DRAFT = 'DRAFT',
    IN_EXECUTION = 'IN_EXECUTION',
    AWAITING_FISCAL = 'AWAITING_FISCAL',
    APPROVED = 'APPROVED',
    SUBMITTED = 'SUBMITTED'
}

export enum InstrumentType {
    CONVENIO = 'CONVENIO',
    TERMO_FOMENTO = 'TERMO_FOMENTO',
    TERMO_COLABORACAO = 'TERMO_COLABORACAO',
    PDDE = 'PDDE'
}

export interface AccountabilityProjectProps {
    associationId: UniqueEntityID;
    name: string;
    grantor: string;
    instrumentType: InstrumentType;
    instrumentNumber?: string;
    periodStart: Date;
    periodEnd: Date;
    bankAccountId?: string;
    status: AccountabilityStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export class AccountabilityProject extends Entity<AccountabilityProjectProps> {
    get associationId(): UniqueEntityID { return this.props.associationId; }
    get name(): string { return this.props.name; }
    get status(): AccountabilityStatus { return this.props.status; }

    private constructor(props: AccountabilityProjectProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: AccountabilityProjectProps, id?: UniqueEntityID): AccountabilityProject {
        return new AccountabilityProject(props, id);
    }
}
