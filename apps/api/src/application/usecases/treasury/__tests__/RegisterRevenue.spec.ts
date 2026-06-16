import { PrismaClient } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { RegisterTransactionDTO } from '../../../../interfaces/http/dtos/TreasuryDTOs';
import { RegisterTransaction } from '../RegisterTransaction';
import { RegisterRevenue } from '../RegisterRevenue';

function makeDto(): RegisterTransactionDTO {
    return {
        date: '2026-06-16T12:00:00.000Z',
        description: 'Receita de teste',
        amount: 100,
        debitAccountId: '00000000-0000-0000-0000-000000000001',
        creditAccountId: '00000000-0000-0000-0000-000000000002',
        documentId: '00000000-0000-0000-0000-000000000003'
    };
}

function makeUseCase(creditAccount: { type: string } | null) {
    const prisma = {
        financialAccount: {
            findUnique: vi.fn().mockResolvedValue(creditAccount)
        }
    } as unknown as PrismaClient;
    const baseUseCase = {
        execute: vi.fn().mockResolvedValue({ id: 'entry-1' })
    } as unknown as RegisterTransaction;

    return {
        useCase: new RegisterRevenue(prisma, baseUseCase),
        baseExecute: baseUseCase.execute as ReturnType<typeof vi.fn>
    };
}

describe('RegisterRevenue', () => {
    it('delegates when the credit account is a revenue account', async () => {
        const { useCase, baseExecute } = makeUseCase({ type: 'REVENUE' });
        const dto = makeDto();

        await expect(useCase.execute(dto, 'association-1', 'actor-1')).resolves.toEqual({ id: 'entry-1' });
        expect(baseExecute).toHaveBeenCalledWith(dto, 'association-1', 'actor-1');
    });

    it('blocks revenue entries when the credit account is not a revenue account', async () => {
        const { useCase, baseExecute } = makeUseCase({ type: 'ASSET' });

        await expect(useCase.execute(makeDto(), 'association-1', 'actor-1'))
            .rejects.toThrow('Receitas devem usar uma conta de credito do tipo REVENUE.');
        expect(baseExecute).not.toHaveBeenCalled();
    });

    it('fails when the credit account does not exist', async () => {
        const { useCase, baseExecute } = makeUseCase(null);

        await expect(useCase.execute(makeDto(), 'association-1', 'actor-1'))
            .rejects.toThrow('Conta de credito nao encontrada.');
        expect(baseExecute).not.toHaveBeenCalled();
    });
});
