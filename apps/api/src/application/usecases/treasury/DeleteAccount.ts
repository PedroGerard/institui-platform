import { PrismaClient } from '@prisma/client';

export class DeleteAccount {
    constructor(private prisma: PrismaClient) { }

    async execute(accountId: string, associationId: string) {
        const account = await this.prisma.financialAccount.findUnique({
            where: { id: accountId },
            include: {
                debitEntries: { select: { id: true }, take: 1 },
                creditEntries: { select: { id: true }, take: 1 },
                children: { select: { id: true }, take: 1 }
            }
        });

        if (!account || account.associationId !== associationId) {
            throw new Error('Conta não encontrada.');
        }

        // Rule: Cannot delete account with movement
        if (account.debitEntries.length > 0 || account.creditEntries.length > 0) {
            throw new Error('Não é possível excluir uma conta que possui lançamentos contábeis. (NBC T 10.19)');
        }

        // Rule: Cannot delete account with children
        if (account.children.length > 0) {
            throw new Error('Não é possível excluir uma conta sintética que possui subcontas.');
        }

        await this.prisma.financialAccount.delete({
            where: { id: accountId }
        });
    }
}
