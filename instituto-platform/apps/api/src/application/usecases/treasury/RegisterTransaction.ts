import { PrismaClient } from '@prisma/client';
import { RegisterTransactionDTO } from '../../../interfaces/http/dtos/TreasuryDTOs';

export class RegisterTransaction {
    constructor(private prisma: PrismaClient) { }

    async execute(dto: RegisterTransactionDTO, associationId: string, actorId: string) {
        const debitAccount = await this.prisma.financialAccount.findUnique({
            where: { id: dto.debitAccountId }
        });
        const creditAccount = await this.prisma.financialAccount.findUnique({
            where: { id: dto.creditAccountId }
        });

        if (!debitAccount || debitAccount.associationId !== associationId) {
            throw new Error('Conta de debito invalida.');
        }

        if (!creditAccount || creditAccount.associationId !== associationId) {
            throw new Error('Conta de credito invalida.');
        }

        if (!debitAccount.isAnalytic || !creditAccount.isAnalytic) {
            throw new Error('Lancamentos so podem ser feitos em contas analiticas.');
        }

        if (!dto.documentId) {
            throw new Error('Documento habil e obrigatorio para lancamentos contabeis.');
        }

        return this.prisma.financialEntry.create({
            data: {
                associationId,
                date: dto.date,
                description: dto.description,
                amount: dto.amount,
                debitAccountId: dto.debitAccountId,
                creditAccountId: dto.creditAccountId,
                documentId: dto.documentId,
                fundId: dto.fundId,
                actorId,
                activityType: dto.activityType
            }
        });
    }
}
