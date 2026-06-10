
import { Mandate } from "../entities/Mandate";
import { LegalErrors, DomainError } from "../shared/LegalErrors";

export class MandateService {

    public static validateNewMandate(newMandate: Mandate, existingMandates: Mandate[]): void {
        for (const mandate of existingMandates) {
            if (mandate.associationId.equals(newMandate.associationId)
                && mandate.role === newMandate.role
                && this.sameGovernanceBody(mandate, newMandate)
                && this.sameSeat(mandate, newMandate)
                && mandate.isActive
                && this.overlaps(mandate, newMandate)) {
                throw new DomainError(LegalErrors.MANDATE_ALREADY_ACTIVE, "This role already has an active mandate for this period.");
            }

            if (mandate.memberId.equals(newMandate.memberId)
                && mandate.isActive
                && this.overlaps(mandate, newMandate)) {
                throw new DomainError(LegalErrors.MANDATE_CONFLICT_ERROR, "Member already holds a mandate in this period.");
            }
        }
    }

    private static overlaps(a: Mandate, b: Mandate): boolean {
        const aEnd = a.endDate ?? new Date(8640000000000000);
        const bEnd = b.endDate ?? new Date(8640000000000000);

        return a.startDate <= bEnd && b.startDate <= aEnd;
    }

    private static sameGovernanceBody(a: Mandate, b: Mandate): boolean {
        if (!a.governanceBodyId && !b.governanceBodyId) {
            return true;
        }

        return Boolean(a.governanceBodyId && b.governanceBodyId && a.governanceBodyId.equals(b.governanceBodyId));
    }

    private static sameSeat(a: Mandate, b: Mandate): boolean {
        const aSeat = a.seatName?.trim().toLowerCase() || "";
        const bSeat = b.seatName?.trim().toLowerCase() || "";

        return aSeat === bSeat;
    }
}
