
// Mirror of apps/api/src/interfaces/http/dtos/DashboardDTOs.ts

export interface LegalEventDTO {
    id: string;
    type: string;
    timestamp: Date | string; // Dates often come as strings from JSON APIs
    actorId?: string;
    payload: Record<string, unknown>;
}

export interface AssociationStatusDTO {
    associationId: string;
    hasActiveStatute: boolean;
    activeStatuteVersion?: number;
    hasActiveMandate: boolean;
    pendingMinutes: number;
    complianceLevel: "GREEN" | "YELLOW" | "RED";
}

export type MemberType = "FOUNDER" | "EFFECTIVE" | "BENEFACTOR" | "COLLABORATOR" | "HONORARY";
export type MemberStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "EXCLUDED";
export type GovernanceRole = "DIRECTOR_PRESIDENT" | "ADMINISTRATIVE_FINANCIAL_DIRECTOR" | "TECHNICAL_DIRECTOR" | "PRESIDENT" | "VICE_PRESIDENT" | "TREASURER" | "SECRETARY" | "FISCAL_COUNCIL" | "FISCAL_COUNCIL_PRESIDENT" | "FISCAL_COUNCIL_MEMBER" | "FISCAL_COUNCIL_SUBSTITUTE" | "DIRECTOR";
export type GovernanceBodyCategory = "GENERAL_ASSEMBLY" | "DIRECTOR_COUNCIL" | "EXECUTIVE_BOARD" | "EXECUTIVE_SECRETARIAT" | "FISCAL_COUNCIL" | "CONSULTATIVE_COUNCIL" | "SCIENTIFIC_COMMITTEE" | "TECHNICAL_COMMITTEE" | "PROJECT_COMMITTEE" | "RESEARCH_COMMITTEE" | "ETHICS_COMMITTEE" | "OTHER";
export type GovernanceBodyMemberRole = "PRESIDENT" | "COORDINATOR" | "SECRETARY" | "RAPPORTEUR" | "MEMBER" | "SUBSTITUTE" | "ADVISOR" | "OTHER";
export type GeneratedDocumentType = "ATA" | "LISTA_PRESENCA" | "ESTATUTO" | "OFICIO" | "PARECER_FISCAL";
export type InstrumentType = "CONVENIO" | "TERMO_FOMENTO" | "TERMO_COLABORACAO" | "PDDE";
export type AccountabilityStatus = "DRAFT" | "IN_EXECUTION" | "AWAITING_FISCAL" | "APPROVED" | "SUBMITTED";
export type DocumentType = "REX" | "OFICIO_ENCAMINHAMENTO" | "PESQUISA_PRECO" | "ATA_COTACAO" | "ATA_HOMOLOGACAO" | "CONTRATO" | "NOTA_FISCAL" | "RECIBO" | "EXTRATO_BANCARIO" | "CERTIDAO_NEGATIVA" | "RELACAO_BENS" | "OUTROS";
export type FiscalOpinionType = "APPROVED" | "REJECTED";
export type ReportType = "PDF" | "XLS";
export type AssemblyType = "AGO" | "AGE";
export type AssemblyStatus = "CALLED" | "HELD" | "CANCELED" | "MINUTES_REGISTERED";
export type ElectionStatus = "DRAFT" | "REGISTERED" | "APPROVED" | "REJECTED" | "MANDATES_CREATED";
export type ElectionSlateStatus = "REGISTERED" | "ELECTED" | "REJECTED";
export type PaymentRequestStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "PAID" | "CANCELED" | "BLOCKED";
export type PaymentApprovalDecision = "APPROVED" | "REJECTED";
export type PaymentApprovalRole = "DIRECTOR_PRESIDENT" | "ADMINISTRATIVE_FINANCIAL_DIRECTOR" | "TECHNICAL_DIRECTOR" | "FISCAL_COUNCIL" | "OTHER";
export type TreasuryReportType = "PAYMENT_SUMMARY_PDF" | "PAYMENT_SUMMARY_XLS";
export type BankStatementEntryType = "CREDIT" | "DEBIT";
export type BankStatementEntryStatus = "PENDING" | "RECONCILED" | "IGNORED";
export type ProcurementProcessStatus = "DRAFT" | "NOTICE_PREPARED" | "QUOTATION_OPEN" | "PRICE_MAP_READY" | "SUPPLIERS_SELECTED" | "HOMOLOGATED" | "CONTRACTED" | "CANCELED";
export type ProcurementJudgmentCriterion = "LOWEST_UNIT_PRICE" | "LOWEST_TOTAL_PRICE";
export type SupplierProposalStatus = "RECEIVED" | "DISQUALIFIED" | "SELECTED";
export type ProcurementDocumentType = "EDITAL_COTACAO_PREVIA" | "MAPA_PRECOS" | "ATA_SELECAO_FORNECEDORES" | "HOMOLOGACAO_FORNECEDOR" | "CONTRATO";
export type ProcurementContractStatus = "DRAFT" | "ACTIVE" | "CLOSED" | "CANCELED";

export interface MemberDTO {
    id: string;
    associationId: string;
    fullName: string;
    cpf: string;
    rg?: string;
    birthDate: string;
    email?: string;
    phone?: string;
    memberType: MemberType;
    status: MemberStatus;
    admissionDate: string;
    resignationDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MandateDTO {
    id: string;
    associationId: string;
    memberId: string;
    governanceBodyId?: string;
    electionId?: string;
    sourceAssemblyId?: string;
    role: GovernanceRole;
    roleName?: string;
    seatName?: string;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ElectionCandidateDTO {
    id: string;
    slateId: string;
    memberId: string;
    role: GovernanceRole;
    roleName?: string;
    seatName?: string;
    sortOrder: number;
    createdAt?: string;
    member?: {
        id: string;
        fullName: string;
        cpf: string;
        status: MemberStatus;
        memberType: MemberType;
    };
}

export interface ElectionSlateDTO {
    id: string;
    electionId: string;
    name: string;
    number?: string;
    status: ElectionSlateStatus;
    votes?: number;
    createdAt?: string;
    updatedAt?: string;
    candidates: ElectionCandidateDTO[];
}

export interface ElectionDTO {
    id: string;
    associationId: string;
    assemblyId?: string;
    governanceBodyId?: string;
    title: string;
    description?: string;
    status: ElectionStatus;
    termStartDate: string;
    termEndDate?: string;
    approvedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    assembly?: {
        id: string;
        title?: string;
        type: AssemblyType;
        status: AssemblyStatus;
        scheduledDate: string;
    };
    governanceBody?: {
        id: string;
        name: string;
        category: GovernanceBodyCategory;
    };
    slates: ElectionSlateDTO[];
    mandates: MandateDTO[];
}

export interface GovernanceBodyMemberDTO {
    id: string;
    governanceBodyId: string;
    memberId?: string;
    externalName?: string;
    externalEmail?: string;
    role: GovernanceBodyMemberRole;
    roleName?: string;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    member?: {
        id: string;
        fullName: string;
        cpf: string;
        email?: string;
        status: MemberStatus;
    };
}

export interface GovernanceBodyDTO {
    id: string;
    associationId: string;
    name: string;
    category: GovernanceBodyCategory;
    description?: string;
    isStatutory: boolean;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    members: GovernanceBodyMemberDTO[];
}

export interface AssemblyAttendanceDTO {
    id: string;
    assemblyId: string;
    memberId?: string;
    externalName?: string;
    hasVotingRight: boolean;
    present: boolean;
    signedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    member?: {
        id: string;
        fullName: string;
        cpf: string;
        status: MemberStatus;
        memberType: MemberType;
    };
}

export interface AssemblyDeliberationDTO {
    id: string;
    assemblyId: string;
    agendaItem: string;
    decision: string;
    result: string;
    requiredQuorum?: string;
    votesFor?: number;
    votesAgainst?: number;
    abstentions?: number;
    createdAt?: string;
}

export interface AssemblyDTO {
    id: string;
    associationId: string;
    type: AssemblyType;
    status: AssemblyStatus;
    title?: string;
    date: string;
    scheduledDate: string;
    callDate?: string;
    callNoticeDays: number;
    callMethod?: string;
    callNoticeText?: string;
    convenerType?: string;
    convenerMemberId?: string;
    location?: string;
    address?: string;
    firstCallAt?: string;
    secondCallAt?: string;
    heldCallNumber?: number;
    totalVotingMembers?: number;
    presentVotingMembers?: number;
    quorumMet?: boolean;
    chairMemberId?: string;
    secretaryMemberId?: string;
    chairMember?: { id: string; fullName: string };
    secretaryMember?: { id: string; fullName: string };
    minutesContent?: string;
    agenda: string[];
    createdAt?: string;
    updatedAt?: string;
    attendances: AssemblyAttendanceDTO[];
    deliberations: AssemblyDeliberationDTO[];
}

export interface GeneratedDocumentDTO {
    id: string;
    associationId: string;
    type: GeneratedDocumentType;
    referenceId?: string;
    title: string;
    fileUrl: string;
    hash?: string;
    generatedById: string;
    createdAt: string;
}

export interface AccountabilityDocumentDTO {
    id: string;
    projectId: string;
    type: DocumentType;
    fileUrl: string;
    isRequired: boolean;
    validated: boolean;
    uploadedAt: string;
}

export interface FiscalOpinionDTO {
    id: string;
    projectId: string;
    councilUserId: string;
    opinion: FiscalOpinionType;
    notes?: string;
    signedAt: string;
}

export interface AccountabilityReportDTO {
    id: string;
    projectId: string;
    type: ReportType;
    fileUrl: string;
    generatedAt: string;
}

export interface AccountabilityProjectDTO {
    id: string;
    associationId: string;
    name: string;
    grantor: string;
    instrumentType: InstrumentType;
    instrumentNumber?: string;
    periodStart: string;
    periodEnd: string;
    bankAccountId?: string;
    status: AccountabilityStatus;
    createdAt: string;
    updatedAt: string;
    documents?: AccountabilityDocumentDTO[];
    fiscalOpinions?: FiscalOpinionDTO[];
    reports?: AccountabilityReportDTO[];
    association?: {
        id: string;
        name: string;
        cnpj: string;
    };
}

export interface AccountabilityChecklistItemDTO {
    type: DocumentType;
    required: boolean;
    sent: boolean;
    validated: boolean;
    pending: boolean;
    documentId?: string;
}

export interface AccountabilityChecklistDTO {
    projectId: string;
    totalRequired: number;
    completedRequired: number;
    pendingRequired: number;
    completionPercentage: number;
    canSubmit: boolean;
    hasApprovedFiscalOpinion: boolean;
    blockingReasons: string[];
    items: AccountabilityChecklistItemDTO[];
}

export interface PaymentApprovalDTO {
    id: string;
    paymentRequestId: string;
    approvedById: string;
    role: PaymentApprovalRole;
    decision: PaymentApprovalDecision;
    notes?: string;
    createdAt: string;
    approvedBy?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export interface PaymentRequestDTO {
    id: string;
    associationId: string;
    requestedById?: string;
    accountabilityProjectId?: string;
    documentId?: string;
    fundId?: string;
    procurementContractId?: string;
    debitAccountId: string;
    creditAccountId: string;
    payeeName: string;
    description: string;
    amount: number;
    dueDate?: string;
    status: PaymentRequestStatus;
    requiresContract: boolean;
    contractFileUrl?: string;
    requiresNegativeCertificate: boolean;
    negativeCertificateExpiresAt?: string;
    paidAt?: string;
    createdAt: string;
    updatedAt: string;
    requestedBy?: { id: string; name: string; email: string; role: string };
    accountabilityProject?: { id: string; name: string; status: AccountabilityStatus; instrumentNumber?: string };
    document?: { id: string; title: string; type: string; status: string };
    fund?: { id: string; name: string; restricted: boolean };
    procurementContract?: {
        id: string;
        contractNumber: string;
        title: string;
        amount: number;
        status: ProcurementContractStatus;
        supplier?: { id: string; name: string; cnpj: string };
    };
    debitAccount?: { id: string; code: string; name: string; type: string };
    creditAccount?: { id: string; code: string; name: string; type: string };
    financialEntry?: { id: string; date: string; amount: number };
    approvals: PaymentApprovalDTO[];
    hardBlockingReasons: string[];
    approvalBlockingReasons: string[];
    paymentBlockingReasons: string[];
}

export interface PaymentRequestSummaryDTO {
    totalRequests: number;
    totalAmount: number;
    overdueCount: number;
    byStatus: Record<PaymentRequestStatus, {
        count: number;
        amount: number;
    }>;
    blockingReasons: Array<{
        reason: string;
        count: number;
    }>;
}

export interface TreasuryReportDTO {
    id: string;
    associationId: string;
    type: TreasuryReportType;
    title: string;
    fileUrl: string;
    generatedById: string;
    createdAt: string;
    generatedBy?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export interface FinancialEntryDTO {
    id: string;
    associationId: string;
    date: string;
    description: string;
    amount: number;
    debitAccountId: string;
    creditAccountId: string;
    documentId?: string;
    fundId?: string;
    paymentRequestId?: string;
    actorId?: string;
    activityType?: string;
    createdAt: string;
    updatedAt: string;
    debitAccount?: { id: string; code: string; name: string; type: string };
    creditAccount?: { id: string; code: string; name: string; type: string };
    document?: { id: string; title: string; type: string; status: string };
    fund?: { id: string; name: string; restricted: boolean };
    paymentRequest?: { id: string; payeeName: string; status: PaymentRequestStatus };
}

export interface BankStatementEntryDTO {
    id: string;
    associationId: string;
    bankAccountId: string;
    financialEntryId?: string;
    transactionDate: string;
    description: string;
    amount: number;
    type: BankStatementEntryType;
    documentNumber?: string;
    status: BankStatementEntryStatus;
    reconciledAt?: string;
    reconciledById?: string;
    createdAt: string;
    updatedAt: string;
    bankAccount?: { id: string; code: string; name: string; type: string };
    financialEntry?: FinancialEntryDTO | null;
}

export interface BankReconciliationSummaryDTO {
    totalEntries: number;
    totalAmount: number;
    pendingCount: number;
    pendingAmount: number;
    reconciledCount: number;
    reconciledAmount: number;
    ignoredCount: number;
    lastReconciledAt?: string | null;
    completionRate: number;
}

export interface SupplierDTO {
    id: string;
    associationId: string;
    name: string;
    cnpj: string;
    email?: string;
    phone?: string;
    address?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProcurementItemDTO {
    id: string;
    processId: string;
    description: string;
    unit?: string;
    quantity: number;
    estimatedUnitPrice?: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface SupplierQuoteItemDTO {
    id: string;
    proposalId: string;
    itemId: string;
    unitPrice: number;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface SupplierProposalDTO {
    id: string;
    processId: string;
    supplierId: string;
    status: SupplierProposalStatus;
    submittedAt: string;
    validUntil?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    supplier: SupplierDTO;
    items: SupplierQuoteItemDTO[];
}

export interface ProcurementDocumentDTO {
    id: string;
    processId: string;
    type: ProcurementDocumentType;
    title: string;
    fileUrl?: string;
    hash?: string;
    generatedById?: string;
    createdAt: string;
}

export interface ProcurementContractDTO {
    id: string;
    associationId: string;
    processId: string;
    supplierId: string;
    contractNumber: string;
    title: string;
    amount: number;
    startDate: string;
    endDate?: string;
    fileUrl?: string;
    status: ProcurementContractStatus;
    createdAt: string;
    updatedAt: string;
    supplier?: SupplierDTO;
}

export interface ProcurementProcessDTO {
    id: string;
    associationId: string;
    accountabilityProjectId?: string;
    title: string;
    noticeNumber: string;
    instrumentNumber?: string;
    object: string;
    justification?: string;
    status: ProcurementProcessStatus;
    judgmentCriterion: ProcurementJudgmentCriterion;
    proposalStartDate: string;
    proposalEndDate: string;
    openingDate?: string;
    publicationUrl?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    createdById?: string;
    createdAt: string;
    updatedAt: string;
    items: ProcurementItemDTO[];
    proposals: SupplierProposalDTO[];
    documents: ProcurementDocumentDTO[];
    contracts: ProcurementContractDTO[];
    accountabilityProject?: { id: string; name: string; status: AccountabilityStatus; instrumentNumber?: string };
}

export interface ProcurementPriceMapDTO {
    processId: string;
    totalItems: number;
    pendingItems: number;
    itemsBelowThreeQuotes: number;
    totalEstimated: number;
    totalWinning: number;
    canSelectSuppliers: boolean;
    rows: Array<{
        item: ProcurementItemDTO;
        quotes: Array<{
            id: string;
            itemId: string;
            proposalId: string;
            supplierId: string;
            supplierName: string;
            supplierCnpj: string;
            unitPrice: number;
            totalPrice: number;
            status: SupplierProposalStatus;
        }>;
        winner: {
            id: string;
            itemId: string;
            proposalId: string;
            supplierId: string;
            supplierName: string;
            supplierCnpj: string;
            unitPrice: number;
            totalPrice: number;
            status: SupplierProposalStatus;
        } | null;
        hasMinimumQuotes: boolean;
    }>;
}
