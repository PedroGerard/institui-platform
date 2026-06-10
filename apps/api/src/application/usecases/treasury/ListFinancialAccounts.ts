import { PrismaClient } from '@prisma/client';

export class ListFinancialAccounts {
    constructor(private prisma: PrismaClient) { }

    async execute(associationId: string) {
        const accounts = await this.prisma.financialAccount.findMany({
            where: { associationId },
            orderBy: { code: 'asc' }
        });
        return accounts;
    }
}
