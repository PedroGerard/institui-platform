
import { MandateService } from './src/domain/services/MandateService.js';
import { Mandate } from './src/domain/entities/Mandate.js';
import { UniqueEntityID } from './src/domain/shared/Entity.js';
import { DateRange } from './src/domain/value-objects/DateRange.js';

console.log('Starting Repro...');

const associationId = new UniqueEntityID();
const roleIdA = new UniqueEntityID();
const memberId1 = new UniqueEntityID();
const electionAssemblyId = new UniqueEntityID();

const term2024 = new DateRange(new Date('2024-01-01'), new Date('2024-12-31'));

const existingMandate = Mandate.create({
    associationId,
    memberId: memberId1,
    roleId: roleIdA,
    term: term2024,
    electionAssemblyId
});

const newMandate = Mandate.create({
    associationId,
    memberId: new UniqueEntityID(), // diff member
    roleId: roleIdA, // SAME ROLE
    term: term2024,
    electionAssemblyId
});

try {
    MandateService.validateNewMandate(newMandate, [existingMandate]);
    console.log('FAILED: Did not throw error.');
} catch (e: any) {
    console.log('SUCCESS: Threw error:', e.message);
}
