import { describe, it, expect } from 'vitest';
import { GovernanceRole, Mandate } from '../entities/Mandate.js';
import { MandateService } from '../services/MandateService.js';
import { UniqueEntityID } from '../shared/Entity.js';

describe('MandateService', () => {
    const associationId = new UniqueEntityID();
    const memberId1 = new UniqueEntityID();
    const memberId2 = new UniqueEntityID();

    function makeMandate(props: {
        memberId: UniqueEntityID;
        governanceBodyId?: UniqueEntityID;
        role: GovernanceRole;
        seatName?: string;
        startDate: Date;
        endDate?: Date;
        isActive?: boolean;
    }) {
        return Mandate.create({
            associationId,
            memberId: props.memberId,
            governanceBodyId: props.governanceBodyId,
            role: props.role,
            seatName: props.seatName,
            startDate: props.startDate,
            endDate: props.endDate,
            isActive: props.isActive ?? true
        });
    }

    it('allows creating a mandate when no active conflict exists', () => {
        const mandate = makeMandate({
            memberId: memberId1,
            role: GovernanceRole.PRESIDENT,
            startDate: new Date('2026-01-01')
        });

        expect(() => MandateService.validateNewMandate(mandate, [])).not.toThrow();
    });

    it('blocks a second active mandate for the same role in the association', () => {
        const existing = makeMandate({
            memberId: memberId1,
            role: GovernanceRole.PRESIDENT,
            startDate: new Date('2026-01-01')
        });
        const mandate = makeMandate({
            memberId: memberId2,
            role: GovernanceRole.PRESIDENT,
            startDate: new Date('2026-02-01')
        });

        expect(() => MandateService.validateNewMandate(mandate, [existing]))
            .toThrow("active mandate");
    });

    it('allows the same role when statutory seats are distinct', () => {
        const existing = makeMandate({
            memberId: memberId1,
            role: GovernanceRole.FISCAL_COUNCIL_MEMBER,
            seatName: 'Titular 1',
            startDate: new Date('2026-01-01')
        });
        const mandate = makeMandate({
            memberId: memberId2,
            role: GovernanceRole.FISCAL_COUNCIL_MEMBER,
            seatName: 'Titular 2',
            startDate: new Date('2026-01-01')
        });

        expect(() => MandateService.validateNewMandate(mandate, [existing])).not.toThrow();
    });

    it('blocks overlapping active mandates for the same member', () => {
        const existing = makeMandate({
            memberId: memberId1,
            role: GovernanceRole.PRESIDENT,
            startDate: new Date('2026-01-01')
        });
        const mandate = makeMandate({
            memberId: memberId1,
            role: GovernanceRole.TREASURER,
            startDate: new Date('2026-02-01')
        });

        expect(() => MandateService.validateNewMandate(mandate, [existing]))
            .toThrow("Member already holds a mandate");
    });
});
