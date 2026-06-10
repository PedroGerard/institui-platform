
import { Entity, UniqueEntityID } from "../shared/Entity";

export interface RoleProps {
    name: string; // e.g. "President", "First Secretary"
    description?: string;
    isAdministrative: boolean; // Board of Directors vs Fiscal Council
    requiredByStatute: boolean;
}

export class Role extends Entity<RoleProps> {
    private constructor(props: RoleProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: RoleProps, id?: UniqueEntityID): Role {
        return new Role(props, id);
    }
}
