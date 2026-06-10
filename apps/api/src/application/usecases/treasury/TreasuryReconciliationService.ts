import {
    AccountType,
    AuditAction,
    BankStatementEntryStatus,
    BankStatementEntryType,
    Prisma,
    PrismaClient
} from "@prisma/client";
import {
    CreateBankStatementEntryDTO,
    ListBankStatementEntriesDTO,
    ListReconciliationCandidatesDTO,
    ReconcileBankStatementEntryDTO
} from "../../../interfaces/http/dtos/TreasuryDTOs";

export class TreasuryReconciliationService {
    constructor(private readonly prisma: PrismaClient) { }

    async create(input: CreateBankStatementEntryDTO, performedById?: string) {
        await this.assertBankAccount(input.associationId, input.bankAccountId);

        const entry = await this.prisma.bankStatementEntry.create({
            data: {
                associationId: input.associationId,
                bankAccountId: input.bankAccountId,
                transactionDate: input.transactionDate,
                description: input.description,
                amount: input.amount,
                type: input.type,
                documentNumber: input.documentNumber
            },
            include: this.defaultInclude()
        });

        await this.audit({
            associationId: input.associationId,
            entity: "BankStatementEntry",
            entityId: entry.id,
            action: AuditAction.CREATE,
            performedById,
            metadata: {
                type: entry.type,
                amount: this.decimalToNumber(entry.amount),
                bankAccountId: entry.bankAccountId,
                transactionDate: entry.transactionDate
            }
        });

        return this.toDTO(entry);
    }

    async list(filters: ListBankStatementEntriesDTO) {
        const entries = await this.prisma.bankStatementEntry.findMany({
            where: {
                associationId: filters.associationId,
                bankAccountId: filters.bankAccountId,
                status: filters.status,
                type: filters.type
            },
            include: this.defaultInclude(),
            orderBy: [
                { transactionDate: "desc" },
                { createdAt: "desc" }
            ]
        });

        return entries.map((entry) => this.toDTO(entry));
    }

    async summary(associationId: string) {
        const entries = await this.prisma.bankStatementEntry.findMany({
            where: { associationId },
            select: {
                amount: true,
                type: true,
                status: true,
                reconciledAt: true
            }
        });

        const totals = entries.reduce((acc, entry) => {
            const signedAmount = this.signedAmount(entry.amount, entry.type);

            acc.totalEntries += 1;
            acc.totalAmount += signedAmount;

            if (entry.status === BankStatementEntryStatus.PENDING) {
                acc.pendingCount += 1;
                acc.pendingAmount += signedAmount;
            }

            if (entry.status === BankStatementEntryStatus.RECONCILED) {
                acc.reconciledCount += 1;
                acc.reconciledAmount += signedAmount;

                if (!acc.lastReconciledAt || (entry.reconciledAt && entry.reconciledAt > acc.lastReconciledAt)) {
                    acc.lastReconciledAt = entry.reconciledAt;
                }
            }

            if (entry.status === BankStatementEntryStatus.IGNORED) {
                acc.ignoredCount += 1;
            }

            return acc;
        }, {
            totalEntries: 0,
            totalAmount: 0,
            pendingCount: 0,
            pendingAmount: 0,
            reconciledCount: 0,
            reconciledAmount: 0,
            ignoredCount: 0,
            lastReconciledAt: null as Date | null
        });

        const completionRate = totals.totalEntries
            ? Math.round((totals.reconciledCount / totals.totalEntries) * 100)
            : 0;

        return {
            ...totals,
            completionRate
        };
    }

    async listCandidates(filters: ListReconciliationCandidatesDTO) {
        const where: Prisma.FinancialEntryWhereInput = {
            associationId: filters.associationId,
            bankStatementEntry: null
        };

        if (filters.amount) {
            where.amount = filters.amount;
        }

        if (filters.bankAccountId && filters.type === BankStatementEntryType.CREDIT) {
            where.debitAccountId = filters.bankAccountId;
        } else if (filters.bankAccountId && filters.type === BankStatementEntryType.DEBIT) {
            where.creditAccountId = filters.bankAccountId;
        } else if (filters.bankAccountId) {
            where.OR = [
                { debitAccountId: filters.bankAccountId },
                { creditAccountId: filters.bankAccountId }
            ];
        }

        const entries = await this.prisma.financialEntry.findMany({
            where,
            include: {
                debitAccount: true,
                creditAccount: true,
                document: true,
                fund: true,
                paymentRequest: true
            },
            orderBy: [
                { date: "desc" },
                { createdAt: "desc" }
            ],
            take: 100
        });

        return entries.map((entry) => ({
            ...entry,
            amount: this.decimalToNumber(entry.amount)
        }));
    }

    async reconcile(id: string, input: ReconcileBankStatementEntryDTO, performedById?: string) {
        const statementEntry = await this.getRawById(id);

        if (statementEntry.status === BankStatementEntryStatus.IGNORED) {
            throw new Error("Movimento ignorado nao pode ser conciliado.");
        }

        const financialEntry = await this.prisma.financialEntry.findUnique({
            where: { id: input.financialEntryId },
            include: {
                bankStatementEntry: true
            }
        });

        if (!financialEntry || financialEntry.associationId !== statementEntry.associationId) {
            throw new Error("Lancamento financeiro invalido para esta associacao.");
        }

        if (financialEntry.bankStatementEntry && financialEntry.bankStatementEntry.id !== id) {
            throw new Error("Lancamento financeiro ja conciliado com outro movimento bancario.");
        }

        this.assertCompatible(statementEntry, financialEntry);

        const reconciledById = await this.ensureActor(statementEntry.associationId, performedById);
        const reconciled = await this.prisma.bankStatementEntry.update({
            where: { id },
            data: {
                financialEntryId: financialEntry.id,
                status: BankStatementEntryStatus.RECONCILED,
                reconciledAt: new Date(),
                reconciledById
            },
            include: this.defaultInclude()
        });

        await this.audit({
            associationId: statementEntry.associationId,
            entity: "BankStatementEntry",
            entityId: id,
            action: AuditAction.UPDATE,
            performedById: reconciledById,
            metadata: {
                status: BankStatementEntryStatus.RECONCILED,
                financialEntryId: financialEntry.id
            }
        });

        return this.toDTO(reconciled);
    }

    async unreconcile(id: string, performedById?: string) {
        const statementEntry = await this.getRawById(id);

        const updated = await this.prisma.bankStatementEntry.update({
            where: { id },
            data: {
                financialEntryId: null,
                status: BankStatementEntryStatus.PENDING,
                reconciledAt: null,
                reconciledById: null
            },
            include: this.defaultInclude()
        });

        await this.audit({
            associationId: statementEntry.associationId,
            entity: "BankStatementEntry",
            entityId: id,
            action: AuditAction.UPDATE,
            performedById,
            metadata: {
                previousStatus: statementEntry.status,
                status: BankStatementEntryStatus.PENDING
            }
        });

        return this.toDTO(updated);
    }

    async ignore(id: string, reason?: string, performedById?: string) {
        const statementEntry = await this.getRawById(id);

        const updated = await this.prisma.bankStatementEntry.update({
            where: { id },
            data: {
                financialEntryId: null,
                status: BankStatementEntryStatus.IGNORED,
                reconciledAt: null,
                reconciledById: null
            },
            include: this.defaultInclude()
        });

        await this.audit({
            associationId: statementEntry.associationId,
            entity: "BankStatementEntry",
            entityId: id,
            action: AuditAction.UPDATE,
            performedById,
            metadata: {
                previousStatus: statementEntry.status,
                status: BankStatementEntryStatus.IGNORED,
                reason
            }
        });

        return this.toDTO(updated);
    }

    private async getRawById(id: string) {
        const entry = await this.prisma.bankStatementEntry.findUnique({
            where: { id },
            include: this.defaultInclude()
        });

        if (!entry) {
            throw new Error("Movimento bancario nao encontrado.");
        }

        return entry;
    }

    private async assertBankAccount(associationId: string, bankAccountId: string) {
        const account = await this.prisma.financialAccount.findUnique({
            where: { id: bankAccountId }
        });

        if (!account || account.associationId !== associationId) {
            throw new Error("Conta bancaria invalida para esta associacao.");
        }

        if (account.type !== AccountType.ASSET || !account.isAnalytic) {
            throw new Error("A conciliacao deve usar uma conta bancaria analitica do ativo.");
        }
    }

    private assertCompatible(statementEntry: Awaited<ReturnType<TreasuryReconciliationService["getRawById"]>>, financialEntry: {
        amount: Prisma.Decimal;
        debitAccountId: string;
        creditAccountId: string;
    }) {
        const statementAmount = this.decimalToNumber(statementEntry.amount);
        const financialAmount = this.decimalToNumber(financialEntry.amount);

        if (Math.abs(statementAmount - financialAmount) > 0.009) {
            throw new Error("Valor do extrato e valor do lancamento financeiro nao conferem.");
        }

        if (statementEntry.type === BankStatementEntryType.CREDIT && financialEntry.debitAccountId !== statementEntry.bankAccountId) {
            throw new Error("Credito bancario deve conciliar com lancamento que debita a conta bancaria.");
        }

        if (statementEntry.type === BankStatementEntryType.DEBIT && financialEntry.creditAccountId !== statementEntry.bankAccountId) {
            throw new Error("Debito bancario deve conciliar com lancamento que credita a conta bancaria.");
        }
    }

    private async audit(input: {
        associationId: string;
        entity: string;
        entityId: string;
        action: AuditAction;
        performedById?: string;
        metadata: Record<string, unknown>;
    }) {
        const performedById = await this.ensureActor(input.associationId, input.performedById);

        await this.prisma.auditLog.create({
            data: {
                associationId: input.associationId,
                entity: input.entity,
                entityId: input.entityId,
                action: input.action,
                performedById,
                metadata: input.metadata as Prisma.InputJsonValue
            }
        });
    }

    private async ensureActor(associationId: string, performedById?: string) {
        if (performedById) {
            const user = await this.prisma.user.findUnique({ where: { id: performedById } });

            if (user) {
                return user.id;
            }
        }

        const existingUser = await this.prisma.user.findFirst({
            where: { associationId },
            orderBy: { createdAt: "asc" }
        });

        if (existingUser) {
            return existingUser.id;
        }

        const systemEmail = `system+${associationId}@institui.local`;
        const systemUser = await this.prisma.user.upsert({
            where: { email: systemEmail },
            update: {},
            create: {
                associationId,
                name: "Sistema INSTITUI+",
                email: systemEmail,
                role: "SYSTEM"
            }
        });

        return systemUser.id;
    }

    private defaultInclude() {
        return {
            bankAccount: true,
            financialEntry: {
                include: {
                    debitAccount: true,
                    creditAccount: true,
                    document: true,
                    fund: true,
                    paymentRequest: true
                }
            }
        };
    }

    private toDTO(entry: Awaited<ReturnType<TreasuryReconciliationService["getRawById"]>>) {
        return {
            ...entry,
            amount: this.decimalToNumber(entry.amount),
            financialEntry: entry.financialEntry
                ? {
                    ...entry.financialEntry,
                    amount: this.decimalToNumber(entry.financialEntry.amount)
                }
                : null
        };
    }

    private signedAmount(amount: Prisma.Decimal, type: BankStatementEntryType) {
        const value = this.decimalToNumber(amount);
        return type === BankStatementEntryType.DEBIT ? value * -1 : value;
    }

    private decimalToNumber(value: Prisma.Decimal) {
        return Number(value.toString());
    }
}
