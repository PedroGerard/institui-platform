import { Entity, UniqueEntityID } from "../shared/Entity";

export enum CouncilType {
    FISCAL = 'FISCAL',
    ADMINISTRATIVO = 'ADMINISTRATIVO'
}

export enum CouncilRole {
    PRESIDENT = 'PRESIDENT',
    MEMBER = 'MEMBER',
    SUBSTITUTE = 'SUBSTITUTE'
}

export interface CouncilMemberProps {
    councilId: UniqueEntityID;
    userId: string; // Linking to User or Member ID
    role: CouncilRole;
    startDate: Date;
    endDate?: Date;
}

export class CouncilMember extends Entity<CouncilMemberProps> {
    get councilId(): UniqueEntityID { return this.props.councilId; }
    get userId(): string { return this.props.userId; }
    get role(): CouncilRole { return this.props.role; }
    get startDate(): Date { return this.props.startDate; }
    get endDate(): Date | undefined { return this.props.endDate; }

    private constructor(props: CouncilMemberProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: CouncilMemberProps, id?: UniqueEntityID): CouncilMember {
        return new CouncilMember(props, id);
    }
}

export interface CouncilProps {
    associationId: UniqueEntityID;
    type: CouncilType;
    members?: CouncilMember[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class Council extends Entity<CouncilProps> {
    get associationId(): UniqueEntityID { return this.props.associationId; }
    get type(): CouncilType { return this.props.type; }
    get members(): CouncilMember[] { return this.props.members || []; }

    private constructor(props: CouncilProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: CouncilProps, id?: UniqueEntityID): Council {
        return new Council(props, id);
    }

    public addMember(member: CouncilMember) {
        if (!this.props.members) this.props.members = [];
        this.props.members.push(member);
    }
}
