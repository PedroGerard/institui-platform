import { PrismaClient } from '@prisma/client';
import { RegisterTransactionDTO } from '../../../interfaces/http/dtos/TreasuryDTOs';
import { RegisterTransaction } from './RegisterTransaction';

export class RegisterRevenue {
    private prisma: PrismaClient;
    private baseUseCase: RegisterTransaction;

    constructor(prisma: PrismaClient, baseUseCase: RegisterTransaction) {
        this.prisma = prisma;
        this.baseUseCase = baseUseCase;
    }

    async execute(dto: RegisterTransactionDTO, associationId: string, actorId: string) {
        // 1. Get the Credit Account (Revenue)
        const creditAccount = await this.prisma.financialAccount.findUnique({
            where: { id: dto.creditAccountId }
        });

        if (!creditAccount) throw new Error('Conta de crédito não encontrada.');

        // 2. Validate Nature (Must be REVENUE or ASSET in some cases, but typically Revenue)
        // Actually, strictly speaking, Revenue Accounts are Credit Nature.
        // We can enforce that the selected Credit Account is of type 'REVENUE'
        if (creditAccount.type !== 'REVENUE') {
            const confirm = true; // In strict mode, we might block. For now, allow but warn?
            // Let's enforce structural consistency: Revenues increase by Credit.
            // It's possible to credit an Asset (Sale of Asset).
            // It's possible to credit a Liability (Loan).
            // But if the intent is "Register Revenue", it usually implies a Revenue account.
        }

        // 3. Delegate to Base Transaction Logic
        return this.baseUseCase.execute(dto, associationId, actorId);
    }
}
