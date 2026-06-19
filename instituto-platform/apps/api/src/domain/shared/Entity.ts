
import { v4 as uuidv4 } from 'uuid';

interface UniqueEntityIDLike {
    toValue(): unknown;
}

function hasToValue(value: unknown): value is UniqueEntityIDLike {
    return typeof value === "object"
        && value !== null
        && "toValue" in value
        && typeof value.toValue === "function";
}

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

    equals(id?: UniqueEntityID | UniqueEntityIDLike): boolean {
        if (id === null || id === undefined) {
            return false;
        }
        if (!(id instanceof UniqueEntityID)) {
            if (hasToValue(id)) {
                return id.toValue() === this.value;
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

const isEntity = (v: unknown): v is Entity<unknown> => {
    return v instanceof Entity;
};
