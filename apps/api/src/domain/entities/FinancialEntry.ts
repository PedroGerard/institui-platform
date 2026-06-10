
import { Entity, UniqueEntityID } from "../shared/Entity";
import { LegalErrors, DomainError } from "../shared/LegalErrors";

export enum EntryType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE"
}

export interface FinancialEntryProps {
    associationId: UniqueEntityID;
    amount: number; // Integer cents
    type: EntryType;
    date: Date;
    description: string;
    category: string;
}

export class FinancialEntry extends Entity<FinancialEntryProps> {
    private constructor(props: FinancialEntryProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: FinancialEntryProps, id?: UniqueEntityID): FinancialEntry {
        if (props.amount < 0) {
            throw new DomainError(LegalErrors.INVALID_AMOUNT, "Amount must be positive integer");
        }

        return new FinancialEntry(props, id);
    }
}
