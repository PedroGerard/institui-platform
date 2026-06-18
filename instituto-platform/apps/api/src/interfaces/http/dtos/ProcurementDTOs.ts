import { z } from "zod";
import {
    ProcurementJudgmentCriterion,
    ProcurementProcessStatus,
    SupplierProposalStatus
} from "@prisma/client";

const emptyToUndefined = z.string().optional().transform((value) => value || undefined);

export const createSupplierSchema = z.object({
    associationId: z.string().uuid(),
    name: z.string().min(2),
    cnpj: z.string().min(11),
    email: emptyToUndefined,
    phone: emptyToUndefined,
    address: emptyToUndefined
});

export const listSuppliersSchema = z.object({
    associationId: z.string().uuid().optional(),
    search: z.string().optional()
});

export const createProcurementProcessSchema = z.object({
    associationId: z.string().uuid(),
    accountabilityProjectId: emptyToUndefined,
    title: z.string().min(3),
    noticeNumber: z.string().min(1),
    instrumentNumber: emptyToUndefined,
    object: z.string().min(5),
    justification: emptyToUndefined,
    judgmentCriterion: z.nativeEnum(ProcurementJudgmentCriterion).optional(),
    proposalStartDate: z.string().datetime(),
    proposalEndDate: z.string().datetime(),
    openingDate: emptyToUndefined,
    publicationUrl: emptyToUndefined,
    contactName: emptyToUndefined,
    contactEmail: emptyToUndefined,
    contactPhone: emptyToUndefined
});

export const listProcurementProcessesSchema = z.object({
    associationId: z.string().uuid().optional(),
    accountabilityProjectId: z.string().uuid().optional(),
    status: z.nativeEnum(ProcurementProcessStatus).optional()
});

export const addProcurementItemSchema = z.object({
    description: z.string().min(3),
    unit: emptyToUndefined,
    quantity: z.number().positive(),
    estimatedUnitPrice: z.number().positive().optional()
});

export const createSupplierProposalSchema = z.object({
    supplierId: z.string().uuid(),
    validUntil: emptyToUndefined,
    notes: z.string().optional(),
    items: z.array(z.object({
        itemId: z.string().uuid(),
        unitPrice: z.number().positive()
    })).min(1)
});

export const updateSupplierProposalStatusSchema = z.object({
    status: z.nativeEnum(SupplierProposalStatus)
});

export const createProcurementContractSchema = z.object({
    supplierId: z.string().uuid(),
    contractNumber: z.string().min(1),
    title: z.string().min(3),
    amount: z.number().positive(),
    startDate: z.string().datetime(),
    endDate: emptyToUndefined,
    fileUrl: emptyToUndefined
});

export type CreateSupplierDTO = z.infer<typeof createSupplierSchema>;
export type ListSuppliersDTO = z.infer<typeof listSuppliersSchema>;
export type CreateProcurementProcessDTO = z.infer<typeof createProcurementProcessSchema>;
export type ListProcurementProcessesDTO = z.infer<typeof listProcurementProcessesSchema>;
export type AddProcurementItemDTO = z.infer<typeof addProcurementItemSchema>;
export type CreateSupplierProposalDTO = z.infer<typeof createSupplierProposalSchema>;
export type CreateProcurementContractDTO = z.infer<typeof createProcurementContractSchema>;
