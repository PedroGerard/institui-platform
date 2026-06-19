
import { describe, it, expect } from 'vitest';
import { StatuteMutationService } from '../services/StatuteMutationService.js';
import { Statute, StatuteVersion } from '../entities/Statute.js';
import { UniqueEntityID } from '../shared/Entity.js';

describe('Statute Rules (Immutability)', () => {

    const associationId = new UniqueEntityID();

    it('should BLOCK mutation if active version is REGISTERED (Immutability Lock)', () => {
        // 1. Create a Registered Version
        const v1 = StatuteVersion.create({
            versionNumber: 1,
            approvalDate: new Date(),
            registrationDate: new Date(), // REGISTERED
            content: "Original Content",
            originatingAssemblyId: new UniqueEntityID(),
            isConsolidated: true
        });

        const statute = Statute.create({
            associationId,
            versions: [v1],
            activeVersionId: v1.id
        });

        // 2. Validate Mutation -> Should Fail
        expect(() => StatuteMutationService.validateMutation(statute))
            .toThrow("Cannot mutate a registered statute");
    });

    it('should ALLOW mutation if active version is NOT REGISTERED (Draft Mode)', () => {
        const vDraft = StatuteVersion.create({
            versionNumber: 2,
            approvalDate: new Date(),
            registrationDate: undefined, // NOT REGISTERED
            content: "Draft Content",
            originatingAssemblyId: new UniqueEntityID(),
            isConsolidated: false
        });

        const statute = Statute.create({
            associationId,
            versions: [vDraft],
            activeVersionId: vDraft.id
        });

        expect(() => StatuteMutationService.validateMutation(statute)).not.toThrow();
    });

});
