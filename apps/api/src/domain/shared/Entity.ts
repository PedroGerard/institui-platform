
import { v4 as uuidv4 } from 'uuid';

export class UniqueEntityID {
    private value: string;

    constructor(id?: string) {
        this.value = id ? id : uuidv4();
    }

    toString() {
        return this.value;
    }

    toValue() {
        return this.value;
    }

    equals(id?: UniqueEntityID): boolean {
        if (id === null || id === undefined) {
            return false;
        }
        if (!(id instanceof UniqueEntityID)) {
            // Fallback: Check structural equality (value) for mixed environment/versions
            if (typeof (id as any).toValue === 'function') {
                return (id as any).toValue() === this.value;
            }
            return false;
        }
        return id.toValue() === this.value;

    }
}

export abstract class Entity<T> {
    protected readonly _id: UniqueEntityID;
    public readonly props: T;

    constructor(props: T, id?: UniqueEntityID) {
        this._id = id ? id : new UniqueEntityID();
        this.props = props;
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    public equals(object?: Entity<T>): boolean {
        if (object == null || object == undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }

        return this._id.equals(object._id);
    }
}

const isEntity = (v: any): v is Entity<any> => {
    return v instanceof Entity;
};
