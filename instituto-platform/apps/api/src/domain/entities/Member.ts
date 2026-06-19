import { Entity, UniqueEntityID } from "../shared/Entity";

export enum MemberType {
    FOUNDER = 'FOUNDER',
    EFFECTIVE = 'EFFECTIVE',
    BENEFACTOR = 'BENEFACTOR',
    COLLABORATOR = 'COLLABORATOR',
    HONORARY = 'HONORARY'
}

export enum MemberStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    EXCLUDED = 'EXCLUDED'
}

export interface MemberProps {
    associationId: UniqueEntityID;
    fullName: string;
    cpf: string;
    rg?: string;
    birthDate: Date;
    email?: string;
    phone?: string;
    memberType: MemberType;
    status: MemberStatus;
    admissionDate: Date;
    resignationDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Member extends Entity<MemberProps> {
    get associationId(): UniqueEntityID { return this.props.associationId; }
    get fullName(): string { return this.props.fullName; }
    get cpf(): string { return this.props.cpf; }
    get rg(): string | undefined { return this.props.rg; }
    get birthDate(): Date { return this.props.birthDate; }
    get email(): string | undefined { return this.props.email; }
    get phone(): string | undefined { return this.props.phone; }
    get memberType(): MemberType { return this.props.memberType; }
    get status(): MemberStatus { return this.props.status; }
    get admissionDate(): Date { return this.props.admissionDate; }
    get resignationDate(): Date | undefined { return this.props.resignationDate; }
    get createdAt(): Date | undefined { return this.props.createdAt; }
    get updatedAt(): Date | undefined { return this.props.updatedAt; }

    private constructor(props: MemberProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: MemberProps, id?: UniqueEntityID): Member {
        return new Member(props, id);
    }

    public isActive(): boolean {
        return this.props.status === MemberStatus.ACTIVE;
    }

    public updateStatus(status: MemberStatus, resignationDate?: Date) {
        this.props.status = status;
        if (status !== MemberStatus.ACTIVE && resignationDate) {
            this.props.resignationDate = resignationDate;
        }
        if (status === MemberStatus.ACTIVE) {
            this.props.resignationDate = undefined;
        }
        this.props.updatedAt = new Date();
    }
}
