
import { describe, it, expect } from 'vitest';
import { Assembly, AssemblyType, AssemblyStatus } from '../entities/Assembly.js';
import { AssemblyService } from '../services/AssemblyService.js';
import { Statute, StatuteVersion } from '../entities/Statute.js';
import { UniqueEntityID } from '../shared/Entity.js';
import { Quorum } from '../value-objects/Quorum.js';

describe('Assembly Rules (Structure & Competence)', () => {

    const associationId = new UniqueEntityID();

    // Helper to create basic statute
    const createStatute = () => {
        const v1 = StatuteVersion.create({
            versionNumber: 1,
            approvalDate: new Date(),
            registrationDate: new Date(),
            content: "Standard Statute",
            originatingAssemblyId: new UniqueEntityID(),
            isConsolidated: true
        });
        return Statute.create({
            associationId,
            versions: [v1],
            activeVersionId: v1.id
        });
    };

    const statute = createStatute();

    it('should BLOCK AGO from discussing exclusive AGE topics (Statute Change) - Competence Lock', () => {
        // AGO trying to change statute
        const agenda = ["STATUTE_CHANGE"];
        expect(() => AssemblyService.validateAgendaCompetence(AssemblyType.AGO, agenda, statute))
            .toThrow("cannot deliberate on"); // Message from service

    });

    it('should ALLOW AGE to discuss Statute Change', () => {
        const agenda = ["STATUTE_CHANGE"];
        expect(() => AssemblyService.validateAgendaCompetence(AssemblyType.AGE, agenda, statute))
            .not.toThrow();
    });

    it('should BLOCK calling hold() if Assembly is not CALLED (Double Hold Lock)', () => {
        const assembly = Assembly.create({
            associationId,
            type: AssemblyType.AGO,
            date: new Date(),
            scheduledDate: new Date(),
            status: AssemblyStatus.CALLED,
            agendaItemIds: ["ACCOUNTS_APPROVAL"],
            callNoticeDays: 15
        });

        // 1. Hold first time - Should OK
        assembly.hold();
        expect(assembly.status).toBe(AssemblyStatus.HELD);
        expect(assembly.domainEvents.length).toBeGreaterThan(0); // Should have AssemblyHeld event

        // 2. Hold second time - Should Block
        expect(() => assembly.hold())
            .toThrow("Assembly already held"); // Match message from Assembly.ts
    });

    it('requires absolute majority for first call quorum', () => {
        const assembly = Assembly.create({
            associationId,
            type: AssemblyType.AGE,
            date: new Date(),
            scheduledDate: new Date(),
            status: AssemblyStatus.CALLED,
            agendaItemIds: ["STATUTE_CHANGE"],
            callNoticeDays: 8
        });

        expect(() => AssemblyService.validateQuorum(assembly, new Quorum(5, 10, 0), 1))
            .toThrow("absolute majority");

        expect(() => AssemblyService.validateQuorum(assembly, new Quorum(6, 10, 0), 1))
            .not.toThrow();
    });

    it('allows second call with any voting member present', () => {
        const assembly = Assembly.create({
            associationId,
            type: AssemblyType.AGE,
            date: new Date(),
            scheduledDate: new Date(),
            status: AssemblyStatus.CALLED,
            agendaItemIds: ["STATUTE_CHANGE"],
            callNoticeDays: 8
        });

        expect(() => AssemblyService.validateQuorum(assembly, new Quorum(0, 10, 0), 2))
            .toThrow("at least one");

        expect(() => AssemblyService.validateQuorum(assembly, new Quorum(1, 10, 0), 2))
            .not.toThrow();
    });

});
