import { Entity, UniqueEntityID } from "../shared/Entity";

export enum GovernanceRole {
    DIRECTOR_PRESIDENT = 'DIRECTOR_PRESIDENT',
    ADMINISTRATIVE_FINANCIAL_DIRECTOR = 'ADMINISTRATIVE_FINANCIAL_DIRECTOR',
    TECHNICAL_DIRECTOR = 'TECHNICAL_DIRECTOR',
    PRESIDENT = 'PRESIDENT',
    VICE_PRESIDENT = 'VICE_PRESIDENT',
    TREASURER = 'TREASURER',
    SECRETARY = 'SECRETARY',
    FISCAL_COUNCIL = 'FISCAL_COUNCIL',
    FISCAL_COUNCIL_PRESIDENT = 'FISCAL_COUNCIL_PRESIDENT',
    FISCAL_COUNCIL_MEMBER = 'FISCAL_COUNCIL_MEMBER',
    FISCAL_COUNCIL_SUBSTITUTE = 'FISCAL_COUNCIL_SUBSTITUTE',
    DIRECTOR = 'DIRECTOR'
}

export interface MandateProps {
    associationId: UniqueEntityID;
    memberId: UniqueEntityID;
    governanceBodyId?: UniqueEntityID;
    electionId?: UniqueEntityID;
    sourceAssemblyId?: UniqueEntityID;
    role: GovernanceRole;
    roleName?: string;
    seatName?: string;
    startDate: Date;
    endDate?: Date;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Mandate extends Entity<MandateProps> {
    get associationId(): UniqueEntityID { return this.props.associationId; }
    get memberId(): UniqueEntityID { return this.props.memberId; }
    get governanceBodyId(): UniqueEntityID | undefined { return this.props.governanceBodyId; }
    get electionId(): UniqueEntityID | undefined { return this.props.electionId; }
    get sourceAssemblyId(): UniqueEntityID | undefined { return this.props.sourceAssemblyId; }
    get role(): GovernanceRole { return this.props.role; }
    get roleName(): string | undefined { return this.props.roleName; }
    get seatName(): string | undefined { return this.props.seatName; }
    get startDate(): Date { return this.props.startDate; }
    get endDate(): Date | undefined { return this.props.endDate; }
    get isActive(): boolean { return this.props.isActive; }
    get createdAt(): Date | undefined { return this.props.createdAt; }
    get updatedAt(): Date | undefined { return this.props.updatedAt; }

    private constructor(props: MandateProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: MandateProps, id?: UniqueEntityID): Mandate {
        // Validation: End date must be after start date
        if (props.endDate && props.endDate < props.startDate) {
            throw new Error("End date cannot be before start date");
        }
        return new Mandate(props, id);
    }

    public close(endDate: Date = new Date()) {
        if (endDate < this.props.startDate) {
            throw new Error("End date cannot be before start date");
        }
        this.props.endDate = endDate;
        this.props.isActive = false;
        this.props.updatedAt = new Date();
    }
}
