import { PrismaClient } from '@prisma/client';
import { RegisterTransactionDTO } from '../../../interfaces/http/dtos/TreasuryDTOs';
import { RegisterTransaction } from './RegisterTransaction';

export class RegisterExpense {
    private prisma: PrismaClient;
    private baseUseCase: RegisterTransaction;

    constructor(prisma: PrismaClient, baseUseCase: RegisterTransaction) {
        this.prisma = prisma;
        this.baseUseCase = baseUseCase;
    }

    async execute(dto: RegisterTransactionDTO, associationId: string, actorId: string) {
        // 1. Get the Debit Account (Expense)
        const debitAccount = await this.prisma.financialAccount.findUnique({
            where: { id: dto.debitAccountId }
        });

        if (!debitAccount) throw new Error('Conta de débito não encontrada.');

        // 2. Validate Nature (Must be EXPENSE or LIABILITY reduction, or ASSET acquisition)
        // Expenses increase by Debit.

        // 3. Delegate to Base Transaction Logic
        return this.baseUseCase.execute(dto, associationId, actorId);
    }
}
