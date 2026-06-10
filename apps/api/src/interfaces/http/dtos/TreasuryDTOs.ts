import { z } from 'zod';
import { BankStatementEntryStatus, BankStatementEntryType, PaymentApprovalRole, PaymentRequestStatus, TreasuryReportType } from '@prisma/client';

export const registerTransactionSchema = z.object({
    date: z.string().datetime(), // ISO Date
    description: z.string().min(3),
    amount: z.number().positive(),

    debitAccountId: z.string().uuid(),
    creditAccountId: z.string().uuid(),

    documentId: z.string().uuid(),
    fundId: z.string().uuid().optional(),
    activityType: z.enum(['EDUCATION', 'HEALTH', 'ASSISTANCE', 'ADMIN', 'OTHER']).optional(),
});

export type RegisterTransactionDTO = z.infer<typeof registerTransactionSchema>;

const emptyToUndefined = z.string().optional().transform((value) => value || undefined);

export const createPaymentRequestSchema = z.object({
    associationId: z.string().uuid(),
    accountabilityProjectId: emptyToUndefined,
    documentId: emptyToUndefined,
    fundId: emptyToUndefined,
    procurementContractId: emptyToUndefined,
    debitAccountId: z.string().uuid(),
    creditAccountId: z.string().uuid(),
    payeeName: z.string().min(2),
    description: z.string().min(3),
    amount: z.number().positive(),
    dueDate: emptyToUndefined,
    requiresContract: z.boolean().optional(),
    contractFileUrl: emptyToUndefined,
    requiresNegativeCertificate: z.boolean().optional(),
    negativeCertificateExpiresAt: emptyToUndefined
});

export const listPaymentRequestsSchema = z.object({
    associationId: z.string().uuid().optional(),
    status: z.nativeEnum(PaymentRequestStatus).optional(),
    accountabilityProjectId: z.string().uuid().optional()
});

export const paymentApprovalSchema = z.object({
    approvedById: z.string().uuid().optional(),
    role: z.nativeEnum(PaymentApprovalRole),
    notes: z.string().optional()
});

export const payPaymentRequestSchema = z.object({
    paidAt: emptyToUndefined,
    activityType: z.enum(['EDUCATION', 'HEALTH', 'ASSISTANCE', 'ADMIN', 'OTHER']).optional()
});

export const updatePaymentRequestComplianceSchema = z.object({
    accountabilityProjectId: emptyToUndefined,
    documentId: emptyToUndefined,
    fundId: emptyToUndefined,
    procurementContractId: emptyToUndefined,
    requiresContract: z.boolean().optional(),
    contractFileUrl: emptyToUndefined,
    requiresNegativeCertificate: z.boolean().optional(),
    negativeCertificateExpiresAt: emptyToUndefined
});

export const generateTreasuryReportSchema = z.object({
    associationId: z.string().uuid()
});

export const listTreasuryReportsSchema = z.object({
    associationId: z.string().uuid().optional(),
    type: z.nativeEnum(TreasuryReportType).optional()
});

export const createBankStatementEntrySchema = z.object({
    associationId: z.string().uuid(),
    bankAccountId: z.string().uuid(),
    transactionDate: z.string().datetime(),
    description: z.string().min(3),
    amount: z.number().positive(),
    type: z.nativeEnum(BankStatementEntryType),
    documentNumber: emptyToUndefined
});

export const listBankStatementEntriesSchema = z.object({
    associationId: z.string().uuid().optional(),
    bankAccountId: z.string().uuid().optional(),
    status: z.nativeEnum(BankStatementEntryStatus).optional(),
    type: z.nativeEnum(BankStatementEntryType).optional()
});

export const listReconciliationCandidatesSchema = z.object({
    associationId: z.string().uuid().optional(),
    bankAccountId: z.string().uuid().optional(),
    type: z.nativeEnum(BankStatementEntryType).optional(),
    amount: z.coerce.number().positive().optional()
});

export const reconcileBankStatementEntrySchema = z.object({
    financialEntryId: z.string().uuid()
});

export const ignoreBankStatementEntrySchema = z.object({
    reason: z.string().optional()
});

export type CreatePaymentRequestDTO = z.infer<typeof createPaymentRequestSchema>;
export type PaymentApprovalDTO = z.infer<typeof paymentApprovalSchema>;
export type PayPaymentRequestDTO = z.infer<typeof payPaymentRequestSchema>;
export type UpdatePaymentRequestComplianceDTO = z.infer<typeof updatePaymentRequestComplianceSchema>;
export type CreateBankStatementEntryDTO = z.infer<typeof createBankStatementEntrySchema>;
export type ListBankStatementEntriesDTO = z.infer<typeof listBankStatementEntriesSchema>;
export type ListReconciliationCandidatesDTO = z.infer<typeof listReconciliationCandidatesSchema>;
export type ReconcileBankStatementEntryDTO = z.infer<typeof reconcileBankStatementEntrySchema>;
