import {
    AssemblyStatus,
    AssemblyType,
    AccountabilityStatus,
    DocumentType,
    ElectionSlateStatus,
    ElectionStatus,
    FiscalOpinionType,
    GeneratedDocumentType,
    BankStatementEntryStatus,
    BankStatementEntryType,
    GovernanceBodyCategory,
    GovernanceBodyMemberRole,
    GovernanceRole,
    InstrumentType,
    MemberStatus,
    MemberType,
    PaymentApprovalRole,
    PaymentRequestStatus,
    ProcurementDocumentType,
    ProcurementJudgmentCriterion,
    ProcurementProcessStatus,
    SupplierProposalStatus,
    ReportType,
    TreasuryReportType
} from "@/types/dtos";

export const DEFAULT_ASSOCIATION_ID = "e2098492-4217-4348-9c60-a8019b16260a";

export const memberTypeLabels: Record<MemberType, string> = {
    FOUNDER: "Fundador",
    EFFECTIVE: "Efetivo",
    BENEFACTOR: "Benemerito",
    COLLABORATOR: "Colaborador",
    HONORARY: "Honorario"
};

export const memberStatusLabels: Record<MemberStatus, string> = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    SUSPENDED: "Suspenso",
    EXCLUDED: "Excluido"
};

export const governanceRoleLabels: Record<GovernanceRole, string> = {
    DIRECTOR_PRESIDENT: "Diretor Presidente",
    ADMINISTRATIVE_FINANCIAL_DIRECTOR: "Diretor Administrativo-Financeiro",
    TECHNICAL_DIRECTOR: "Diretor Tecnico",
    PRESIDENT: "Presidente",
    VICE_PRESIDENT: "Vice-presidente",
    TREASURER: "Tesoureiro",
    SECRETARY: "Secretario",
    FISCAL_COUNCIL: "Conselho fiscal",
    FISCAL_COUNCIL_PRESIDENT: "Presidente do Conselho Fiscal",
    FISCAL_COUNCIL_MEMBER: "Conselheiro fiscal titular",
    FISCAL_COUNCIL_SUBSTITUTE: "Conselheiro fiscal suplente",
    DIRECTOR: "Diretor"
};

export const governanceBodyCategoryLabels: Record<GovernanceBodyCategory, string> = {
    GENERAL_ASSEMBLY: "Assembleia geral",
    DIRECTOR_COUNCIL: "Conselho diretor",
    EXECUTIVE_BOARD: "Diretoria executiva",
    EXECUTIVE_SECRETARIAT: "Secretaria executiva",
    FISCAL_COUNCIL: "Conselho fiscal",
    CONSULTATIVE_COUNCIL: "Conselho consultivo",
    SCIENTIFIC_COMMITTEE: "Comite cientifico",
    TECHNICAL_COMMITTEE: "Comite tecnico",
    PROJECT_COMMITTEE: "Comite de projetos",
    RESEARCH_COMMITTEE: "Comite de pesquisa",
    ETHICS_COMMITTEE: "Comite de etica",
    OTHER: "Outro orgao"
};

export const governanceBodyMemberRoleLabels: Record<GovernanceBodyMemberRole, string> = {
    PRESIDENT: "Presidente",
    COORDINATOR: "Coordenador",
    SECRETARY: "Secretario",
    RAPPORTEUR: "Relator",
    MEMBER: "Membro",
    SUBSTITUTE: "Suplente",
    ADVISOR: "Consultor",
    OTHER: "Outro"
};

export const generatedDocumentTypeLabels: Record<GeneratedDocumentType, string> = {
    ATA: "Ata de Assembleia",
    LISTA_PRESENCA: "Lista de Presenca",
    ESTATUTO: "Estatuto Consolidado",
    OFICIO: "Oficio/Requerimento",
    PARECER_FISCAL: "Parecer Fiscal"
};

export const accountabilityStatusLabels: Record<AccountabilityStatus, string> = {
    DRAFT: "Rascunho",
    IN_EXECUTION: "Em execucao",
    AWAITING_FISCAL: "Aguardando fiscal",
    APPROVED: "Aprovada",
    SUBMITTED: "Submetida"
};

export const instrumentTypeLabels: Record<InstrumentType, string> = {
    CONVENIO: "Convenio",
    TERMO_FOMENTO: "Termo de fomento",
    TERMO_COLABORACAO: "Termo de colaboracao",
    PDDE: "PDDE"
};

export const documentTypeLabels: Record<DocumentType, string> = {
    REX: "REX",
    OFICIO_ENCAMINHAMENTO: "Oficio de encaminhamento",
    PESQUISA_PRECO: "Pesquisa de preco",
    ATA_COTACAO: "Ata de cotacao",
    ATA_HOMOLOGACAO: "Ata de homologacao",
    CONTRATO: "Contrato",
    NOTA_FISCAL: "Nota fiscal",
    RECIBO: "Recibo",
    EXTRATO_BANCARIO: "Extrato bancario",
    CERTIDAO_NEGATIVA: "Certidao negativa",
    RELACAO_BENS: "Relacao de bens",
    OUTROS: "Outros"
};

export const fiscalOpinionLabels: Record<FiscalOpinionType, string> = {
    APPROVED: "Aprovado",
    REJECTED: "Rejeitado"
};

export const reportTypeLabels: Record<ReportType, string> = {
    PDF: "PDF",
    XLS: "XLS"
};

export const assemblyTypeLabels: Record<AssemblyType, string> = {
    AGO: "Assembleia Geral Ordinaria",
    AGE: "Assembleia Geral Extraordinaria"
};

export const assemblyStatusLabels: Record<AssemblyStatus, string> = {
    CALLED: "Convocada",
    HELD: "Realizada",
    CANCELED: "Cancelada",
    MINUTES_REGISTERED: "Ata registrada"
};

export const electionStatusLabels: Record<ElectionStatus, string> = {
    DRAFT: "Rascunho",
    REGISTERED: "Registrada",
    APPROVED: "Homologada",
    REJECTED: "Rejeitada",
    MANDATES_CREATED: "Mandatos gerados"
};

export const electionSlateStatusLabels: Record<ElectionSlateStatus, string> = {
    REGISTERED: "Registrada",
    ELECTED: "Eleita",
    REJECTED: "Rejeitada"
};

export const paymentRequestStatusLabels: Record<PaymentRequestStatus, string> = {
    DRAFT: "Rascunho",
    PENDING_APPROVAL: "Aguardando aprovacoes",
    APPROVED: "Aprovado",
    REJECTED: "Rejeitado",
    PAID: "Pago",
    CANCELED: "Cancelado",
    BLOCKED: "Bloqueado"
};

export const paymentApprovalRoleLabels: Record<PaymentApprovalRole, string> = {
    DIRECTOR_PRESIDENT: "Diretor Presidente",
    ADMINISTRATIVE_FINANCIAL_DIRECTOR: "Diretor Administrativo-Financeiro",
    TECHNICAL_DIRECTOR: "Diretor Tecnico",
    FISCAL_COUNCIL: "Conselho Fiscal",
    OTHER: "Outro"
};

export const treasuryReportTypeLabels: Record<TreasuryReportType, string> = {
    PAYMENT_SUMMARY_PDF: "Relatorio de Pagamentos PDF",
    PAYMENT_SUMMARY_XLS: "Relatorio de Pagamentos XLS"
};

export const bankStatementEntryTypeLabels: Record<BankStatementEntryType, string> = {
    CREDIT: "Credito",
    DEBIT: "Debito"
};

export const bankStatementEntryStatusLabels: Record<BankStatementEntryStatus, string> = {
    PENDING: "Pendente",
    RECONCILED: "Conciliado",
    IGNORED: "Ignorado"
};

export const procurementProcessStatusLabels: Record<ProcurementProcessStatus, string> = {
    DRAFT: "Rascunho",
    NOTICE_PREPARED: "Edital preparado",
    QUOTATION_OPEN: "Cotacao aberta",
    PRICE_MAP_READY: "Mapa pronto",
    SUPPLIERS_SELECTED: "Fornecedores selecionados",
    HOMOLOGATED: "Homologado",
    CONTRACTED: "Contratado",
    CANCELED: "Cancelado"
};

export const procurementJudgmentCriterionLabels: Record<ProcurementJudgmentCriterion, string> = {
    LOWEST_UNIT_PRICE: "Menor preco unitario",
    LOWEST_TOTAL_PRICE: "Menor preco total"
};

export const supplierProposalStatusLabels: Record<SupplierProposalStatus, string> = {
    RECEIVED: "Recebida",
    DISQUALIFIED: "Desclassificada",
    SELECTED: "Selecionada"
};

export const procurementDocumentTypeLabels: Record<ProcurementDocumentType, string> = {
    EDITAL_COTACAO_PREVIA: "Edital de Cotacao Previa",
    MAPA_PRECOS: "Mapa de Precos",
    ATA_SELECAO_FORNECEDORES: "Ata de Selecao de Fornecedores",
    HOMOLOGACAO_FORNECEDOR: "Homologacao de Fornecedor",
    CONTRATO: "Contrato"
};

export function formatCurrency(value?: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value || 0);
}

export function formatDate(value?: string | Date) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
}
