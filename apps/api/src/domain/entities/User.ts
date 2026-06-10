
import { Entity, UniqueEntityID } from "../shared/Entity";

export enum UserRole {
    ADM = "ADM", // Secretary / President / Administrator
    MEMBER = "MEMBER", // Regular associate (Read only mainly)
    AUDITOR = "AUDITOR" // Fiscal Council
}

export interface UserProps {
    name: string;
    email: string;
    role: UserRole;
    associationId: UniqueEntityID;
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: UserProps, id?: UniqueEntityID): User {
        return new User(props, id);
    }

    get role(): UserRole {
        return this.props.role;
    }

    public canPerformSecretarialActs(): boolean {
        return this.props.role === UserRole.ADM;
    }
}
