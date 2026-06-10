
import { AggregateRoot } from "../shared/AggregateRoot";
import { UniqueEntityID } from "../shared/Entity";

export enum ReportStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface AccountabilityReportProps {
    associationId: UniqueEntityID;
    periodStart: Date;
    periodEnd: Date;
    fiscalCouncilOpinionId?: UniqueEntityID; // Opinion document
    approvalAssemblyId?: UniqueEntityID; // AGO that approved it
    status: ReportStatus;
}

export class AccountabilityReport extends AggregateRoot<AccountabilityReportProps> {
    private constructor(props: AccountabilityReportProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: AccountabilityReportProps, id?: UniqueEntityID): AccountabilityReport {
        return new AccountabilityReport(props, id);
    }
}
