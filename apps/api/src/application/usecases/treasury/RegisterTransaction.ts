import { PrismaClient, FinancialAccount } from '@prisma/client';
import { RegisterTransactionDTO } from '../../../interfaces/http/dtos/TreasuryDTOs';

export class RegisterTransaction {
    constructor(private prisma: PrismaClient) { }

    async execute(dto: RegisterTransactionDTO, associationId: string, actorId: string) {
        // 1. Validate Accounts
        const debitAccount = await this.prisma.financialAccount.findUnique({
            where: { id: dto.debitAccountId }
        });
        const creditAccount = await this.prisma.financialAccount.findUnique({
            where: { id: dto.creditAccountId }
        });

        if (!debitAccount || debitAccount.associationId !== associationId) {
            throw new Error('Conta de Débito inválida.');
        }
        if (!creditAccount || creditAccount.associationId !== associationId) {
            throw new Error('Conta de Crédito inválida.');
        }

        if (!debitAccount.isAnalytic || !creditAccount.isAnalytic) {
            throw new Error('Lançamentos só podem ser feitos em contas Analíticas.');
        }

        // 3. Validation: Documento Hábil (Strict Compliance)
        if (!dto.documentId) {
            throw new Error('Documento hábil é obrigatório para lançamentos contábeis (NBC T 10.19).');
        }

        // 2. Create Entry
        const entry = await this.prisma.financialEntry.create({
            data: {
                associationId,
                date: dto.date,
                description: dto.description,
                amount: dto.amount,
                debitAccountId: dto.debitAccountId,
                creditAccountId: dto.creditAccountId,
                documentId: dto.documentId,
                fundId: dto.fundId,
                actorId: actorId,
                activityType: dto.activityType
            }
        });

        return entry;
    }
}
