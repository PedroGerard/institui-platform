import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
    AccountabilityStatus,
    DocumentType,
    FiscalOpinionType,
    Prisma,
    InstrumentType,
    PrismaClient,
    ReportType
} from "@prisma/client";
import { PdfGeneratorService } from "../../../domain/services/PdfGeneratorService";

export const REQUIRED_ACCOUNTABILITY_DOCUMENTS: DocumentType[] = [
    DocumentType.REX,
    DocumentType.OFICIO_ENCAMINHAMENTO,
    DocumentType.PESQUISA_PRECO,
    DocumentType.ATA_COTACAO,
    DocumentType.ATA_HOMOLOGACAO,
    DocumentType.CONTRATO,
    DocumentType.NOTA_FISCAL,
    DocumentType.RECIBO,
    DocumentType.EXTRATO_BANCARIO,
    DocumentType.CERTIDAO_NEGATIVA,
    DocumentType.RELACAO_BENS
];

export interface CreateAccountabilityProjectInput {
    associationId: string;
    name: string;
    grantor: string;
    instrumentType: InstrumentType;
    instrumentNumber?: string;
    periodStart: Date;
    periodEnd: Date;
    bankAccountId?: string;
    performedById?: string;
}

export interface UploadAccountabilityDocumentInput {
    type: DocumentType;
    fileUrl: string;
    isRequired?: boolean;
    performedById?: string;
}

export interface RegisterFiscalOpinionInput {
    councilUserId: string;
    opinion: FiscalOpinionType;
    notes?: string;
}

export interface ListAccountabilityProjectsFilters {
    associationId?: string;
    status?: AccountabilityStatus;
    year?: number;
    instrumentType?: InstrumentType;
}

export interface AccountabilityChecklistItem {
    type: DocumentType;
    required: boolean;
    sent: boolean;
    validated: boolean;
    pending: boolean;
    documentId?: string;
}

export interface AccountabilityChecklist {
    projectId: string;
    totalRequired: number;
    completedRequired: number;
    pendingRequired: number;
    completionPercentage: number;
    canSubmit: boolean;
    hasApprovedFiscalOpinion: boolean;
    blockingReasons: string[];
    items: AccountabilityChecklistItem[];
}

export class AccountabilityService {
    private readonly reportStorageDir = path.resolve(process.cwd(), "storage", "accountability-reports");

    constructor(
        private readonly prisma: PrismaClient,
        private readonly pdfService: PdfGeneratorService
    ) { }

    async createProject(input: CreateAccountabilityProjectInput) {
        if (input.periodEnd < input.periodStart) {
            throw new Error("Period end must be after period start");
        }

        const association = await this.prisma.association.findUnique({
            where: { id: input.associationId }
        });

        if (!association) {
            throw new Error("Association not found");
        }

        const project = await this.prisma.accountabilityProject.create({
            data: {
                associationId: input.associationId,
                name: input.name,
                grantor: input.grantor,
                instrumentType: input.instrumentType,
                instrumentNumber: input.instrumentNumber,
                periodStart: input.periodStart,
                periodEnd: input.periodEnd,
                bankAccountId: input.bankAccountId,
                status: AccountabilityStatus.DRAFT
            },
            include: this.projectInclude()
        });

        await this.audit({
            associationId: input.associationId,
            entity: "AccountabilityProject",
            entityId: project.id,
            action: "CREATE",
            performedById: input.performedById,
            metadata: { name: project.name, instrumentType: project.instrumentType }
        });

        return project;
    }

    async listProjects(filters: ListAccountabilityProjectsFilters = {}) {
        const dateFilter = filters.year
            ? {
                periodStart: {
                    gte: new Date(Date.UTC(filters.year, 0, 1)),
                    lte: new Date(Date.UTC(filters.year, 11, 31, 23, 59, 59))
                }
            }
            : {};

        return this.prisma.accountabilityProject.findMany({
            where: {
                associationId: filters.associationId,
                status: filters.status,
                instrumentType: filters.instrumentType,
                ...dateFilter
            },
            include: this.projectInclude(),
            orderBy: { createdAt: "desc" }
        });
    }

    async getProject(id: string) {
        const project = await this.prisma.accountabilityProject.findUnique({
            where: { id },
            include: this.projectInclude()
        });

        if (!project) {
            throw new Error("Accountability project not found");
        }

        return project;
    }

    async updateStatus(id: string, status: AccountabilityStatus, performedById?: string) {
        const project = await this.getProject(id);

        const updated = await this.prisma.accountabilityProject.update({
            where: { id },
            data: { status },
            include: this.projectInclude()
        });

        await this.audit({
            associationId: project.associationId,
            entity: "AccountabilityProject",
            entityId: id,
            action: "UPDATE",
            performedById,
            metadata: { previousStatus: project.status, status }
        });

        return updated;
    }

    async uploadDocument(projectId: string, input: UploadAccountabilityDocumentInput) {
        const project = await this.getProject(projectId);
        const document = await this.prisma.accountabilityDocument.create({
            data: {
                projectId,
                type: input.type,
                fileUrl: input.fileUrl,
                isRequired: input.isRequired ?? REQUIRED_ACCOUNTABILITY_DOCUMENTS.includes(input.type),
                validated: false
            }
        });

        await this.audit({
            associationId: project.associationId,
            entity: "AccountabilityDocument",
            entityId: document.id,
            action: "CREATE",
            performedById: input.performedById,
            metadata: { projectId, type: document.type, fileUrl: document.fileUrl }
        });

        return document;
    }

    async listDocuments(projectId: string) {
        await this.getProject(projectId);

        return this.prisma.accountabilityDocument.findMany({
            where: { projectId },
            orderBy: { uploadedAt: "desc" }
        });
    }

    async validateDocument(documentId: string, validated: boolean, performedById?: string) {
        const current = await this.prisma.accountabilityDocument.findUnique({
            where: { id: documentId },
            include: { project: true }
        });

        if (!current) {
            throw new Error("Accountability document not found");
        }

        const document = await this.prisma.accountabilityDocument.update({
            where: { id: documentId },
            data: { validated }
        });

        await this.audit({
            associationId: current.project.associationId,
            entity: "AccountabilityDocument",
            entityId: documentId,
            action: validated ? "APPROVE" : "REJECT",
            performedById,
            metadata: { projectId: current.projectId, type: current.type, validated }
        });

        return document;
    }

    async generateChecklist(projectId: string): Promise<AccountabilityChecklist> {
        const project = await this.getProject(projectId);
        const documents = project.documents;

        const items = REQUIRED_ACCOUNTABILITY_DOCUMENTS.map((type) => {
            const matchingDocuments = documents.filter((document) => document.type === type);
            const validatedDocument = matchingDocuments.find((document) => document.validated);
            const firstDocument = validatedDocument || matchingDocuments[0];

            return {
                type,
                required: true,
                sent: matchingDocuments.length > 0,
                validated: Boolean(validatedDocument),
                pending: matchingDocuments.length === 0 || !validatedDocument,
                documentId: firstDocument?.id
            };
        });

        const completedRequired = items.filter((item) => item.required && item.sent && item.validated).length;
        const pendingItems = items.filter((item) => item.pending);
        const hasApprovedFiscalOpinion = project.fiscalOpinions.some((opinion) => opinion.opinion === FiscalOpinionType.APPROVED);
        const blockingReasons: string[] = [];

        for (const item of pendingItems) {
            blockingReasons.push(item.sent
                ? `Documento obrigatorio ${item.type} ainda nao validado`
                : `Documento obrigatorio ${item.type} ausente`);
        }

        if (!hasApprovedFiscalOpinion) {
            blockingReasons.push("Parecer fiscal aprovado ausente");
        }

        if (project.status === AccountabilityStatus.SUBMITTED) {
            blockingReasons.push("Prestacao ja submetida");
        }

        const completionPercentage = Math.round((completedRequired / REQUIRED_ACCOUNTABILITY_DOCUMENTS.length) * 100);

        return {
            projectId,
            totalRequired: REQUIRED_ACCOUNTABILITY_DOCUMENTS.length,
            completedRequired,
            pendingRequired: pendingItems.length,
            completionPercentage,
            canSubmit: blockingReasons.length === 0,
            hasApprovedFiscalOpinion,
            blockingReasons,
            items
        };
    }

    async registerFiscalOpinion(projectId: string, input: RegisterFiscalOpinionInput) {
        const project = await this.getProject(projectId);
        await this.assertFiscalCouncilUser(project.associationId, input.councilUserId);

        const opinion = await this.prisma.fiscalOpinion.create({
            data: {
                projectId,
                councilUserId: input.councilUserId,
                opinion: input.opinion,
                notes: input.notes,
                signedAt: new Date()
            }
        });

        await this.audit({
            associationId: project.associationId,
            entity: "FiscalOpinion",
            entityId: opinion.id,
            action: input.opinion === FiscalOpinionType.APPROVED ? "APPROVE" : "REJECT",
            performedById: input.councilUserId,
            metadata: { projectId, opinion: input.opinion }
        });

        return opinion;
    }

    async listFiscalOpinions(projectId: string) {
        await this.getProject(projectId);

        return this.prisma.fiscalOpinion.findMany({
            where: { projectId },
            orderBy: { signedAt: "desc" }
        });
    }

    async generateReport(projectId: string, type: ReportType, performedById?: string) {
        const project = await this.getProject(projectId);
        await mkdir(this.reportStorageDir, { recursive: true });

        const content = this.buildReportContent(project);
        const extension = type === ReportType.PDF ? "pdf" : "xls";
        const draftFileName = `${projectId}-${type.toLowerCase()}-${Date.now()}.${extension}`;
        const draftFilePath = path.join(this.reportStorageDir, draftFileName);

        if (type === ReportType.PDF) {
            const buffer = await this.pdfService.generate({
                title: `Prestacao de Contas - ${project.name}`,
                content,
                footerText: "Relatorio gerado pelo INSTITUI+"
            });
            await writeFile(draftFilePath, buffer);
        } else {
            await writeFile(draftFilePath, this.buildSpreadsheetContent(project), "utf-8");
        }

        const report = await this.prisma.accountabilityReport.create({
            data: {
                projectId,
                type,
                fileUrl: `/accountability/reports/${draftFileName}/download`
            }
        });

        await this.audit({
            associationId: project.associationId,
            entity: "AccountabilityReport",
            entityId: report.id,
            action: "CREATE",
            performedById,
            metadata: { projectId, type, fileUrl: report.fileUrl }
        });

        return report;
    }

    async listReports(projectId: string) {
        await this.getProject(projectId);

        return this.prisma.accountabilityReport.findMany({
            where: { projectId },
            orderBy: { generatedAt: "desc" }
        });
    }

    async submitProject(projectId: string, performedById?: string) {
        const project = await this.getProject(projectId);
        const checklist = await this.generateChecklist(projectId);

        if (!checklist.canSubmit) {
            throw new Error(`Submission blocked: ${checklist.blockingReasons.join("; ")}`);
        }

        const submitted = await this.prisma.accountabilityProject.update({
            where: { id: projectId },
            data: { status: AccountabilityStatus.SUBMITTED },
            include: this.projectInclude()
        });

        await this.audit({
            associationId: project.associationId,
            entity: "AccountabilityProject",
            entityId: projectId,
            action: "UPDATE",
            performedById,
            metadata: { previousStatus: project.status, status: AccountabilityStatus.SUBMITTED }
        });

        return submitted;
    }

    getReportFilePath(fileUrl: string) {
        const fileName = path.basename(fileUrl.replace("/download", ""));
        return path.join(this.reportStorageDir, fileName);
    }

    private async assertFiscalCouncilUser(associationId: string, userId: string) {
        const councilMembership = await this.prisma.council.findFirst({
            where: {
                associationId,
                type: "FISCAL",
                members: {
                    some: { userId }
                }
            }
        });

        if (councilMembership) {
            return;
        }

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const fiscalRoles = ["FISCAL", "FISCAL_COUNCIL", "CONSELHO_FISCAL", "CONSELHEIRO_FISCAL"];

        if (user && user.associationId === associationId && fiscalRoles.includes(user.role)) {
            return;
        }

        throw new Error("Fiscal opinion can only be registered by a fiscal council user");
    }

    private buildReportContent(project: Awaited<ReturnType<AccountabilityService["getProject"]>>) {
        const checklistStats = this.calculateProjectStats(project.documents, project.fiscalOpinions);

        return [
            `Projeto: ${project.name}`,
            `Associacao: ${project.association.name}`,
            `Concedente: ${project.grantor}`,
            `Instrumento: ${project.instrumentType}${project.instrumentNumber ? ` - ${project.instrumentNumber}` : ""}`,
            `Periodo: ${this.formatDate(project.periodStart)} a ${this.formatDate(project.periodEnd)}`,
            `Status: ${project.status}`,
            "",
            "Resumo documental:",
            `Documentos enviados: ${project.documents.length}`,
            `Documentos validados: ${project.documents.filter((document) => document.validated).length}`,
            `Conclusao estimada: ${checklistStats.completionPercentage}%`,
            "",
            "Parecer fiscal:",
            checklistStats.hasApprovedFiscalOpinion ? "Aprovado" : "Pendente ou reprovado",
            "",
            "Documentos:",
            ...(project.documents.length
                ? project.documents.map((document) => `${document.type} - ${document.validated ? "validado" : "pendente"} - ${document.fileUrl}`)
                : ["Nenhum documento cadastrado."])
        ].join("\n");
    }

    private buildSpreadsheetContent(project: Awaited<ReturnType<AccountabilityService["getProject"]>>) {
        const rows = [
            ["Campo", "Valor"],
            ["Projeto", project.name],
            ["Associacao", project.association.name],
            ["Concedente", project.grantor],
            ["Instrumento", project.instrumentType],
            ["Numero", project.instrumentNumber || ""],
            ["Periodo inicial", this.formatDate(project.periodStart)],
            ["Periodo final", this.formatDate(project.periodEnd)],
            ["Status", project.status],
            [],
            ["Documento", "Validado", "Obrigatorio", "URL"]
        ];

        for (const document of project.documents) {
            rows.push([document.type, document.validated ? "Sim" : "Nao", document.isRequired ? "Sim" : "Nao", document.fileUrl]);
        }

        return rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join("\t")).join("\n");
    }

    private calculateProjectStats(
        documents: Awaited<ReturnType<AccountabilityService["getProject"]>>["documents"],
        fiscalOpinions: Awaited<ReturnType<AccountabilityService["getProject"]>>["fiscalOpinions"]
    ) {
        const completedRequired = REQUIRED_ACCOUNTABILITY_DOCUMENTS.filter((type) =>
            documents.some((document) => document.type === type && document.validated)
        ).length;

        return {
            completionPercentage: Math.round((completedRequired / REQUIRED_ACCOUNTABILITY_DOCUMENTS.length) * 100),
            hasApprovedFiscalOpinion: fiscalOpinions.some((opinion) => opinion.opinion === FiscalOpinionType.APPROVED)
        };
    }

    private projectInclude() {
        return {
            association: true,
            documents: {
                orderBy: { uploadedAt: "desc" as const }
            },
            fiscalOpinions: {
                orderBy: { signedAt: "desc" as const }
            },
            reports: {
                orderBy: { generatedAt: "desc" as const }
            }
        };
    }

    private async audit(input: {
        associationId: string;
        entity: string;
        entityId: string;
        action: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT";
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

    private formatDate(value: Date) {
        return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(value);
    }
}
