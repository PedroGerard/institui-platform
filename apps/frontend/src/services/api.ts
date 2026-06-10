
import {
    AccountabilityChecklistDTO,
    AccountabilityDocumentDTO,
    AccountabilityProjectDTO,
    AccountabilityReportDTO,
    AccountabilityStatus,
    AssemblyAttendanceDTO,
    AssemblyDTO,
    AssemblyDeliberationDTO,
    AssemblyType,
    AssociationStatusDTO,
    DocumentType,
    ElectionCandidateDTO,
    ElectionDTO,
    ElectionSlateDTO,
    ElectionStatus,
    FiscalOpinionDTO,
    FiscalOpinionType,
    GeneratedDocumentDTO,
    GeneratedDocumentType,
    GovernanceBodyCategory,
    GovernanceBodyDTO,
    GovernanceBodyMemberDTO,
    GovernanceBodyMemberRole,
    GovernanceRole,
    InstrumentType,
    LegalEventDTO,
    MandateDTO,
    MemberDTO,
    MemberStatus,
    MemberType,
    BankReconciliationSummaryDTO,
    BankStatementEntryDTO,
    BankStatementEntryStatus,
    BankStatementEntryType,
    FinancialEntryDTO,
    ProcurementContractDTO,
    ProcurementJudgmentCriterion,
    ProcurementPriceMapDTO,
    ProcurementProcessDTO,
    ProcurementProcessStatus,
    PaymentApprovalRole,
    PaymentRequestDTO,
    PaymentRequestSummaryDTO,
    PaymentRequestStatus,
    SupplierDTO,
    TreasuryReportDTO,
    TreasuryReportType
} from "../types/dtos";
import { FinancialAccount } from "../types/financial";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

class ApiService {
    public getBaseUrl() {
        return API_BASE_URL;
    }

    private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const headers: Record<string, string> = {
            ...(options?.headers as Record<string, string> | undefined),
        };

        if (options?.body && !headers["Content-Type"]) {
            headers["Content-Type"] = "application/json";
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options,
        });

        if (!response.ok) {
            // Basic error handling - could be expanded to parse standardized LegalErrors later
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || errorBody.error || `API Error: ${response.statusText}`);
        }

        return response.json();
    }

    // --- Read Components ---

    public async getLegalEvents(associationId: string): Promise<LegalEventDTO[]> {
        return this.fetch<LegalEventDTO[]>(`/legal-events/${associationId}`);
    }

    public async getAssociationStatus(associationId: string): Promise<AssociationStatusDTO> {
        return this.fetch<AssociationStatusDTO>(`/association/status/${associationId}`);
    }

    // --- Write Components ---

    public async callAssembly(payload: {
        associationId: string;
        type: AssemblyType;
        date: string;
        agenda: { value: string }[];
        title?: string;
        callMethod?: string;
        callNoticeText?: string;
        convenerType?: string;
        convenerMemberId?: string;
        location?: string;
        address?: string;
        firstCallAt?: string;
        secondCallAt?: string;
    }): Promise<{ id: string; message: string }> {
        return this.fetch<{ id: string; message: string }>("/assemblies/call", {
            method: "POST",
            body: JSON.stringify({
                ...payload,
                agenda: payload.agenda.map(i => i.value),
            }),
        });
    }

    public async listAssemblies(filters?: {
        associationId?: string;
        status?: string;
        type?: AssemblyType;
    }): Promise<AssemblyDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.status) params.set("status", filters.status);
        if (filters?.type) params.set("type", filters.type);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<AssemblyDTO[]>(`/assemblies${query}`);
    }

    public async getAssembly(id: string): Promise<AssemblyDTO> {
        return this.fetch<AssemblyDTO>(`/assemblies/${id}`);
    }

    public async holdAssembly(assemblyId: string, payload?: {
        heldAt?: string;
        heldCallNumber?: number;
        totalVotingMembers?: number;
        presentVotingMembers?: number;
        chairMemberId?: string;
        secretaryMemberId?: string;
    }): Promise<void> {

        return this.fetch<void>(`/assemblies/${assemblyId}/hold`, {
            method: "POST",
            body: payload ? JSON.stringify(payload) : undefined
        });
    }

    public async registerMinutes(assemblyId: string, content: string): Promise<void> {
        return this.fetch<void>(`/assemblies/${assemblyId}/minutes`, {
            method: "POST",
            body: JSON.stringify({ content })
        });
    }

    public async addAssemblyAttendance(assemblyId: string, payload: {
        memberId?: string;
        externalName?: string;
        hasVotingRight?: boolean;
        present?: boolean;
        signedAt?: string;
    }): Promise<AssemblyAttendanceDTO> {
        return this.fetch<AssemblyAttendanceDTO>(`/assemblies/${assemblyId}/attendances`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async addAssemblyDeliberation(assemblyId: string, payload: {
        agendaItem: string;
        decision: string;
        result?: string;
        requiredQuorum?: string;
        votesFor?: number;
        votesAgainst?: number;
        abstentions?: number;
    }): Promise<AssemblyDeliberationDTO> {
        return this.fetch<AssemblyDeliberationDTO>(`/assemblies/${assemblyId}/deliberations`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async listMembers(associationId?: string): Promise<MemberDTO[]> {
        const query = associationId ? `?associationId=${associationId}` : "";
        return this.fetch<MemberDTO[]>(`/members${query}`);
    }

    public async getMember(id: string): Promise<MemberDTO> {
        return this.fetch<MemberDTO>(`/members/${id}`);
    }

    public async createMember(payload: {
        associationId: string;
        fullName: string;
        cpf: string;
        rg?: string;
        birthDate: string;
        email?: string;
        phone?: string;
        memberType: MemberType;
        admissionDate: string;
    }): Promise<MemberDTO> {
        return this.fetch<MemberDTO>("/members", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async updateMemberStatus(id: string, payload: {
        status: MemberStatus;
        resignationDate?: string;
    }): Promise<MemberDTO> {
        return this.fetch<MemberDTO>(`/members/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        });
    }

    public async listMandates(associationId?: string): Promise<MandateDTO[]> {
        const query = associationId ? `?associationId=${associationId}` : "";
        return this.fetch<MandateDTO[]>(`/mandates${query}`);
    }

    public async listActiveMandates(associationId?: string): Promise<MandateDTO[]> {
        const query = associationId ? `?associationId=${associationId}` : "";
        return this.fetch<MandateDTO[]>(`/mandates/active${query}`);
    }

    public async createMandate(payload: {
        associationId: string;
        memberId: string;
        role: GovernanceRole;
        startDate: string;
        endDate?: string;
    }): Promise<MandateDTO> {
        return this.fetch<MandateDTO>("/mandates", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async closeMandate(id: string, endDate?: string): Promise<MandateDTO> {
        return this.fetch<MandateDTO>(`/mandates/${id}/close`, {
            method: "POST",
            body: JSON.stringify({ endDate })
        });
    }

    public async listElections(filters?: {
        associationId?: string;
        status?: ElectionStatus;
        governanceBodyId?: string;
        assemblyId?: string;
    }): Promise<ElectionDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.status) params.set("status", filters.status);
        if (filters?.governanceBodyId) params.set("governanceBodyId", filters.governanceBodyId);
        if (filters?.assemblyId) params.set("assemblyId", filters.assemblyId);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<ElectionDTO[]>(`/elections${query}`);
    }

    public async getElection(id: string): Promise<ElectionDTO> {
        return this.fetch<ElectionDTO>(`/elections/${id}`);
    }

    public async createElection(payload: {
        associationId: string;
        assemblyId?: string;
        governanceBodyId?: string;
        title: string;
        description?: string;
        termStartDate: string;
        termEndDate?: string;
    }): Promise<ElectionDTO> {
        return this.fetch<ElectionDTO>("/elections", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async addElectionSlate(electionId: string, payload: {
        name: string;
        number?: string;
    }): Promise<ElectionSlateDTO> {
        return this.fetch<ElectionSlateDTO>(`/elections/${electionId}/slates`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async addElectionCandidate(slateId: string, payload: {
        memberId: string;
        role: GovernanceRole;
        roleName?: string;
        seatName?: string;
        sortOrder?: number;
    }): Promise<ElectionCandidateDTO> {
        return this.fetch<ElectionCandidateDTO>(`/elections/slates/${slateId}/candidates`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async approveElection(electionId: string, payload: {
        slateId: string;
        votes?: number;
    }): Promise<ElectionDTO> {
        return this.fetch<ElectionDTO>(`/elections/${electionId}/approve`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async createElectionMandates(electionId: string, payload?: {
        startDate?: string;
        endDate?: string;
    }): Promise<MandateDTO[]> {
        return this.fetch<MandateDTO[]>(`/elections/${electionId}/create-mandates`, {
            method: "POST",
            body: JSON.stringify(payload || {})
        });
    }

    public async listGovernanceBodies(filters?: {
        associationId?: string;
        category?: GovernanceBodyCategory;
        active?: boolean;
    }): Promise<GovernanceBodyDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.category) params.set("category", filters.category);
        if (typeof filters?.active === "boolean") params.set("active", String(filters.active));

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<GovernanceBodyDTO[]>(`/governance-bodies${query}`);
    }

    public async getGovernanceBody(id: string): Promise<GovernanceBodyDTO> {
        return this.fetch<GovernanceBodyDTO>(`/governance-bodies/${id}`);
    }

    public async createGovernanceBody(payload: {
        associationId: string;
        name: string;
        category: GovernanceBodyCategory;
        description?: string;
        isStatutory?: boolean;
        isActive?: boolean;
    }): Promise<GovernanceBodyDTO> {
        return this.fetch<GovernanceBodyDTO>("/governance-bodies", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async addGovernanceBodyMember(bodyId: string, payload: {
        memberId?: string;
        externalName?: string;
        externalEmail?: string;
        role: GovernanceBodyMemberRole;
        roleName?: string;
        startDate: string;
        endDate?: string;
    }): Promise<GovernanceBodyMemberDTO> {
        return this.fetch<GovernanceBodyMemberDTO>(`/governance-bodies/${bodyId}/members`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async closeGovernanceBodyMember(memberId: string, endDate?: string): Promise<GovernanceBodyMemberDTO> {
        return this.fetch<GovernanceBodyMemberDTO>(`/governance-bodies/members/${memberId}/close`, {
            method: "POST",
            body: JSON.stringify({ endDate })
        });
    }

    public async listGeneratedDocuments(filters?: {
        associationId?: string;
        type?: GeneratedDocumentType;
    }): Promise<GeneratedDocumentDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.type) params.set("type", filters.type);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<GeneratedDocumentDTO[]>(`/documents/generated${query}`);
    }

    public async getGeneratedDocument(id: string): Promise<GeneratedDocumentDTO> {
        return this.fetch<GeneratedDocumentDTO>(`/documents/generated/${id}`);
    }

    public generatedDocumentDownloadUrl(id: string) {
        return `${API_BASE_URL}/documents/generated/${id}/download`;
    }

    public async generateAssemblyMinute(assemblyId: string): Promise<GeneratedDocumentDTO> {
        return this.fetch<GeneratedDocumentDTO>(`/documents/generate/assembly-minute/${assemblyId}`, {
            method: "POST"
        });
    }

    public async generatePresenceList(assemblyId: string): Promise<GeneratedDocumentDTO> {
        return this.fetch<GeneratedDocumentDTO>(`/documents/generate/presence-list/${assemblyId}`, {
            method: "POST"
        });
    }

    public async generateStatute(associationId: string): Promise<GeneratedDocumentDTO> {
        return this.fetch<GeneratedDocumentDTO>(`/documents/generate/statute/${associationId}`, {
            method: "POST"
        });
    }

    public async generateOfficialLetter(payload: {
        associationId: string;
        referenceId?: string;
        title: string;
        recipient: string;
        subject: string;
        content: string;
    }): Promise<GeneratedDocumentDTO> {
        return this.fetch<GeneratedDocumentDTO>("/documents/generate/official-letter", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async generateFiscalOpinion(projectId: string): Promise<GeneratedDocumentDTO> {
        return this.fetch<GeneratedDocumentDTO>(`/documents/generate/fiscal-opinion/${projectId}`, {
            method: "POST"
        });
    }

    public async listAccountabilityProjects(filters?: {
        associationId?: string;
        status?: AccountabilityStatus;
        year?: string;
        instrumentType?: InstrumentType;
    }): Promise<AccountabilityProjectDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.status) params.set("status", filters.status);
        if (filters?.year) params.set("year", filters.year);
        if (filters?.instrumentType) params.set("instrumentType", filters.instrumentType);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<AccountabilityProjectDTO[]>(`/accountability/projects${query}`);
    }

    public async createAccountabilityProject(payload: {
        associationId: string;
        name: string;
        grantor: string;
        instrumentType: InstrumentType;
        instrumentNumber?: string;
        periodStart: string;
        periodEnd: string;
        bankAccountId?: string;
    }): Promise<AccountabilityProjectDTO> {
        return this.fetch<AccountabilityProjectDTO>("/accountability/projects", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async getAccountabilityProject(id: string): Promise<AccountabilityProjectDTO> {
        return this.fetch<AccountabilityProjectDTO>(`/accountability/projects/${id}`);
    }

    public async updateAccountabilityProjectStatus(id: string, status: AccountabilityStatus): Promise<AccountabilityProjectDTO> {
        return this.fetch<AccountabilityProjectDTO>(`/accountability/projects/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status })
        });
    }

    public async listAccountabilityDocuments(projectId: string): Promise<AccountabilityDocumentDTO[]> {
        return this.fetch<AccountabilityDocumentDTO[]>(`/accountability/projects/${projectId}/documents`);
    }

    public async uploadAccountabilityDocument(projectId: string, payload: {
        type: DocumentType;
        fileUrl: string;
        isRequired?: boolean;
    }): Promise<AccountabilityDocumentDTO> {
        return this.fetch<AccountabilityDocumentDTO>(`/accountability/projects/${projectId}/documents`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async validateAccountabilityDocument(documentId: string, validated: boolean): Promise<AccountabilityDocumentDTO> {
        return this.fetch<AccountabilityDocumentDTO>(`/accountability/documents/${documentId}/validate`, {
            method: "PATCH",
            body: JSON.stringify({ validated })
        });
    }

    public async getAccountabilityChecklist(projectId: string): Promise<AccountabilityChecklistDTO> {
        return this.fetch<AccountabilityChecklistDTO>(`/accountability/projects/${projectId}/checklist`);
    }

    public async registerFiscalOpinion(projectId: string, payload: {
        councilUserId: string;
        opinion: FiscalOpinionType;
        notes?: string;
    }): Promise<FiscalOpinionDTO> {
        return this.fetch<FiscalOpinionDTO>(`/accountability/projects/${projectId}/fiscal-opinion`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async listFiscalOpinions(projectId: string): Promise<FiscalOpinionDTO[]> {
        return this.fetch<FiscalOpinionDTO[]>(`/accountability/projects/${projectId}/fiscal-opinion`);
    }

    public async generateAccountabilityReport(projectId: string, type: "PDF" | "XLS"): Promise<AccountabilityReportDTO> {
        return this.fetch<AccountabilityReportDTO>(`/accountability/projects/${projectId}/reports/${type.toLowerCase()}`, {
            method: "POST"
        });
    }

    public async listAccountabilityReports(projectId: string): Promise<AccountabilityReportDTO[]> {
        return this.fetch<AccountabilityReportDTO[]>(`/accountability/projects/${projectId}/reports`);
    }

    public accountabilityReportDownloadUrl(report: AccountabilityReportDTO) {
        return `${API_BASE_URL}${report.fileUrl}`;
    }

    public async submitAccountabilityProject(projectId: string): Promise<AccountabilityProjectDTO> {
        return this.fetch<AccountabilityProjectDTO>(`/accountability/projects/${projectId}/submit`, {
            method: "POST"
        });
    }

    public async listFinancialAccounts(associationId: string): Promise<FinancialAccount[]> {
        return this.fetch<FinancialAccount[]>("/treasury/accounts", {
            headers: { "x-association-id": associationId }
        });
    }

    public async createTreasuryTransaction(type: "REVENUE" | "EXPENSE", associationId: string, payload: {
        date: string;
        description: string;
        amount: number;
        debitAccountId: string;
        creditAccountId: string;
        documentId: string;
        fundId?: string;
        activityType?: "EDUCATION" | "HEALTH" | "ASSISTANCE" | "ADMIN" | "OTHER";
    }) {
        return this.fetch(type === "REVENUE" ? "/treasury/revenues" : "/treasury/expenses", {
            method: "POST",
            headers: { "x-association-id": associationId },
            body: JSON.stringify(payload)
        });
    }

    public async listPaymentRequests(filters?: {
        associationId?: string;
        status?: PaymentRequestStatus;
        accountabilityProjectId?: string;
    }): Promise<PaymentRequestDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.status) params.set("status", filters.status);
        if (filters?.accountabilityProjectId) params.set("accountabilityProjectId", filters.accountabilityProjectId);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<PaymentRequestDTO[]>(`/treasury/payment-requests${query}`);
    }

    public async getPaymentRequest(id: string): Promise<PaymentRequestDTO> {
        return this.fetch<PaymentRequestDTO>(`/treasury/payment-requests/${id}`);
    }

    public async getPaymentRequestSummary(filters?: {
        associationId?: string;
        accountabilityProjectId?: string;
    }): Promise<PaymentRequestSummaryDTO> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.accountabilityProjectId) params.set("accountabilityProjectId", filters.accountabilityProjectId);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<PaymentRequestSummaryDTO>(`/treasury/payment-requests/summary${query}`);
    }

    public async createPaymentRequest(payload: {
        associationId: string;
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
        requiresContract?: boolean;
        contractFileUrl?: string;
        requiresNegativeCertificate?: boolean;
        negativeCertificateExpiresAt?: string;
    }): Promise<PaymentRequestDTO> {
        return this.fetch<PaymentRequestDTO>("/treasury/payment-requests", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async regularizePaymentRequest(id: string, payload: {
        accountabilityProjectId?: string;
        documentId?: string;
        fundId?: string;
        procurementContractId?: string;
        requiresContract?: boolean;
        contractFileUrl?: string;
        requiresNegativeCertificate?: boolean;
        negativeCertificateExpiresAt?: string;
    }): Promise<PaymentRequestDTO> {
        return this.fetch<PaymentRequestDTO>(`/treasury/payment-requests/${id}/compliance`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        });
    }

    public async approvePaymentRequest(id: string, payload: {
        approvedById?: string;
        role: PaymentApprovalRole;
        notes?: string;
    }): Promise<PaymentRequestDTO> {
        return this.fetch<PaymentRequestDTO>(`/treasury/payment-requests/${id}/approve`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async rejectPaymentRequest(id: string, payload: {
        approvedById?: string;
        role: PaymentApprovalRole;
        notes?: string;
    }): Promise<PaymentRequestDTO> {
        return this.fetch<PaymentRequestDTO>(`/treasury/payment-requests/${id}/reject`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async payPaymentRequest(id: string, payload?: {
        paidAt?: string;
        activityType?: "EDUCATION" | "HEALTH" | "ASSISTANCE" | "ADMIN" | "OTHER";
    }): Promise<PaymentRequestDTO> {
        return this.fetch<PaymentRequestDTO>(`/treasury/payment-requests/${id}/pay`, {
            method: "POST",
            body: JSON.stringify(payload || {})
        });
    }

    public async generateTreasuryPaymentReport(type: "PDF" | "XLS", associationId: string): Promise<TreasuryReportDTO> {
        return this.fetch<TreasuryReportDTO>(`/treasury/reports/payments/${type.toLowerCase()}`, {
            method: "POST",
            body: JSON.stringify({ associationId })
        });
    }

    public async listTreasuryReports(filters?: {
        associationId?: string;
        type?: TreasuryReportType;
    }): Promise<TreasuryReportDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.type) params.set("type", filters.type);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<TreasuryReportDTO[]>(`/treasury/reports${query}`);
    }

    public treasuryReportDownloadUrl(report: TreasuryReportDTO) {
        return `${API_BASE_URL}${report.fileUrl}`;
    }

    public async createBankStatementEntry(payload: {
        associationId: string;
        bankAccountId: string;
        transactionDate: string;
        description: string;
        amount: number;
        type: BankStatementEntryType;
        documentNumber?: string;
    }): Promise<BankStatementEntryDTO> {
        return this.fetch<BankStatementEntryDTO>("/treasury/reconciliation/statements", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async listBankStatementEntries(filters?: {
        associationId?: string;
        bankAccountId?: string;
        status?: BankStatementEntryStatus;
        type?: BankStatementEntryType;
    }): Promise<BankStatementEntryDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.bankAccountId) params.set("bankAccountId", filters.bankAccountId);
        if (filters?.status) params.set("status", filters.status);
        if (filters?.type) params.set("type", filters.type);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<BankStatementEntryDTO[]>(`/treasury/reconciliation/statements${query}`);
    }

    public async getBankReconciliationSummary(associationId: string): Promise<BankReconciliationSummaryDTO> {
        return this.fetch<BankReconciliationSummaryDTO>(`/treasury/reconciliation/summary?associationId=${associationId}`);
    }

    public async listReconciliationCandidates(filters?: {
        associationId?: string;
        bankAccountId?: string;
        type?: BankStatementEntryType;
        amount?: number;
    }): Promise<FinancialEntryDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.bankAccountId) params.set("bankAccountId", filters.bankAccountId);
        if (filters?.type) params.set("type", filters.type);
        if (filters?.amount) params.set("amount", String(filters.amount));

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<FinancialEntryDTO[]>(`/treasury/reconciliation/candidates${query}`);
    }

    public async reconcileBankStatementEntry(id: string, financialEntryId: string): Promise<BankStatementEntryDTO> {
        return this.fetch<BankStatementEntryDTO>(`/treasury/reconciliation/statements/${id}/reconcile`, {
            method: "POST",
            body: JSON.stringify({ financialEntryId })
        });
    }

    public async unreconcileBankStatementEntry(id: string): Promise<BankStatementEntryDTO> {
        return this.fetch<BankStatementEntryDTO>(`/treasury/reconciliation/statements/${id}/unreconcile`, {
            method: "POST"
        });
    }

    public async ignoreBankStatementEntry(id: string, reason?: string): Promise<BankStatementEntryDTO> {
        return this.fetch<BankStatementEntryDTO>(`/treasury/reconciliation/statements/${id}/ignore`, {
            method: "POST",
            body: JSON.stringify({ reason })
        });
    }

    public async createSupplier(payload: {
        associationId: string;
        name: string;
        cnpj: string;
        email?: string;
        phone?: string;
        address?: string;
    }): Promise<SupplierDTO> {
        return this.fetch<SupplierDTO>("/procurements/suppliers", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async listSuppliers(filters?: {
        associationId?: string;
        search?: string;
    }): Promise<SupplierDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.search) params.set("search", filters.search);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<SupplierDTO[]>(`/procurements/suppliers${query}`);
    }

    public async createProcurementProcess(payload: {
        associationId: string;
        accountabilityProjectId?: string;
        title: string;
        noticeNumber: string;
        instrumentNumber?: string;
        object: string;
        justification?: string;
        judgmentCriterion?: ProcurementJudgmentCriterion;
        proposalStartDate: string;
        proposalEndDate: string;
        openingDate?: string;
        publicationUrl?: string;
        contactName?: string;
        contactEmail?: string;
        contactPhone?: string;
    }): Promise<ProcurementProcessDTO> {
        return this.fetch<ProcurementProcessDTO>("/procurements", {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async listProcurementProcesses(filters?: {
        associationId?: string;
        accountabilityProjectId?: string;
        status?: ProcurementProcessStatus;
    }): Promise<ProcurementProcessDTO[]> {
        const params = new URLSearchParams();

        if (filters?.associationId) params.set("associationId", filters.associationId);
        if (filters?.accountabilityProjectId) params.set("accountabilityProjectId", filters.accountabilityProjectId);
        if (filters?.status) params.set("status", filters.status);

        const query = params.toString() ? `?${params.toString()}` : "";
        return this.fetch<ProcurementProcessDTO[]>(`/procurements${query}`);
    }

    public async getProcurementProcess(id: string): Promise<ProcurementProcessDTO> {
        return this.fetch<ProcurementProcessDTO>(`/procurements/${id}`);
    }

    public async addProcurementItem(processId: string, payload: {
        description: string;
        unit?: string;
        quantity: number;
        estimatedUnitPrice?: number;
    }): Promise<ProcurementProcessDTO["items"][number]> {
        return this.fetch<ProcurementProcessDTO["items"][number]>(`/procurements/${processId}/items`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async createSupplierProposal(processId: string, payload: {
        supplierId: string;
        validUntil?: string;
        notes?: string;
        items: Array<{
            itemId: string;
            unitPrice: number;
        }>;
    }): Promise<ProcurementProcessDTO["proposals"][number]> {
        return this.fetch<ProcurementProcessDTO["proposals"][number]>(`/procurements/${processId}/proposals`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }

    public async getProcurementPriceMap(processId: string): Promise<ProcurementPriceMapDTO> {
        return this.fetch<ProcurementPriceMapDTO>(`/procurements/${processId}/price-map`);
    }

    public async selectProcurementSuppliers(processId: string): Promise<ProcurementProcessDTO> {
        return this.fetch<ProcurementProcessDTO>(`/procurements/${processId}/select-suppliers`, {
            method: "POST"
        });
    }

    public async homologateProcurement(processId: string): Promise<ProcurementProcessDTO> {
        return this.fetch<ProcurementProcessDTO>(`/procurements/${processId}/homologate`, {
            method: "POST"
        });
    }

    public async createProcurementContract(processId: string, payload: {
        supplierId: string;
        contractNumber: string;
        title: string;
        amount: number;
        startDate: string;
        endDate?: string;
        fileUrl?: string;
    }): Promise<ProcurementContractDTO> {
        return this.fetch<ProcurementContractDTO>(`/procurements/${processId}/contracts`, {
            method: "POST",
            body: JSON.stringify(payload)
        });
    }
}


export const api = new ApiService();
