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
        const debitAccount = await this.prisma.financialAccount.findUnique({
            where: { id: dto.debitAccountId }
        });

        if (!debitAccount) {
            throw new Error('Conta de debito nao encontrada.');
        }

        return this.baseUseCase.execute(dto, associationId, actorId);
    }
}
