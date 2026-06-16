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
        const creditAccount = await this.prisma.financialAccount.findUnique({
            where: { id: dto.creditAccountId }
        });

        if (!creditAccount) {
            throw new Error('Conta de credito nao encontrada.');
        }

        if (creditAccount.type !== 'REVENUE') {
            throw new Error('Receitas devem usar uma conta de credito do tipo REVENUE.');
        }

        return this.baseUseCase.execute(dto, associationId, actorId);
    }
}
