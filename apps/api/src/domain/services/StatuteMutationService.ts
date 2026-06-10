
import { Statute } from "../entities/Statute";
import { LegalErrors, DomainError } from "../shared/LegalErrors";

export class StatuteMutationService {
    public static validateMutation(currentStatute: Statute): void {
        // Lock 1: Cannot mutate if not consolidated (if that's a rule)
        // Lock 2: Check if Active Version is registered (Immutability)

        const activeVersion = currentStatute.activeVersion;
        if (!activeVersion) return; // No version, free to create

        if (activeVersion.isRegistered) {
            throw new DomainError(LegalErrors.IMMUTABILITY_VIOLATION_ERROR, "Cannot mutate a registered statute version directly. Create a new version/consolidate.");
        }

    }
}
