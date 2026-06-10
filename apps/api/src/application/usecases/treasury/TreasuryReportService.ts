import { createReadStream } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
    AuditAction,
    PaymentRequestStatus,
    Prisma,
    PrismaClient,
    TreasuryReportType
} from "@prisma/client";
import { PdfGeneratorService } from "../../../domain/services/PdfGeneratorService";
import { PaymentRequestService } from "./PaymentRequestService";

export class TreasuryReportService {
    private readonly storageDir = path.resolve(process.cwd(), "storage", "treasury-reports");

    constructor(
        private readonly prisma: PrismaClient,
        private readonly pdfService: PdfGeneratorService,
        private readonly paymentRequestService: PaymentRequestService
    ) { }

    async generatePaymentSummary(input: {
        associationId: string;
        type: TreasuryReportType;
        performedById?: string;
    }) {
        const association = await this.prisma.association.findUnique({
            where: { id: input.associationId }
        });

        if (!association) {
            throw new Error("Associacao nao encontrada.");
        }

        await mkdir(this.storageDir, { recursive: true });

        const summary = await this.paymentRequestService.summary({ associationId: input.associationId });
        const payments = await this.paymentRequestService.list({ associationId: input.associationId });
        const extension = input.type === TreasuryReportType.PAYMENT_SUMMARY_PDF ? "pdf" : "xls";
        const fileName = `${input.associationId}-payment-summary-${Date.now()}.${extension}`;
        const filePath = path.join(this.storageDir, fileName);
        const title = `Relatorio de Pagamentos - ${association.name}`;

        if (input.type === TreasuryReportType.PAYMENT_SUMMARY_PDF) {
            const buffer = await this.pdfService.generate({
                title,
                content: this.buildTextReport(summary, payments),
                footerText: "Relatorio gerado pelo INSTITUI+"
            });
            await writeFile(filePath, buffer);
        } else {
            await writeFile(filePath, this.buildSpreadsheetReport(summary, payments), "utf-8");
        }

        const generatedById = await this.ensureActor(input.associationId, input.performedById);
        const report = await this.prisma.treasuryReport.create({
            data: {
                associationId: input.associationId,
                type: input.type,
                title,
                fileUrl: `/treasury/reports/${fileName}/download`,
                generatedById
            },
            include: this.include()
        });

        await this.audit({
            associationId: input.associationId,
            entity: "TreasuryReport",
            entityId: report.id,
            action: AuditAction.CREATE,
            performedById: generatedById,
            metadata: {
                type: input.type,
                fileUrl: report.fileUrl,
                totalRequests: summary.totalRequests,
                totalAmount: summary.totalAmount
            }
        });

        return report;
    }

    async list(filters: {
        associationId?: string;
        type?: TreasuryReportType;
    } = {}) {
        return this.prisma.treasuryReport.findMany({
            where: {
                associationId: filters.associationId,
                type: filters.type
            },
            include: this.include(),
            orderBy: { createdAt: "desc" }
        });
    }

    async getById(id: string) {
        const report = await this.prisma.treasuryReport.findUnique({
            where: { id },
            include: this.include()
        });

        if (!report) {
            throw new Error("Relatorio de tesouraria nao encontrado.");
        }

        return report;
    }

    async getFileStream(fileName: string) {
        const filePath = path.join(this.storageDir, path.basename(fileName));
        await access(filePath);

        return createReadStream(filePath);
    }

    getContentType(fileName: string) {
        return fileName.endsWith(".pdf")
            ? "application/pdf"
            : "application/vnd.ms-excel";
    }

    private buildTextReport(summary: Awaited<ReturnType<PaymentRequestService["summary"]>>, payments: Awaited<ReturnType<PaymentRequestService["list"]>>) {
        const statusLines = Object.entries(summary.byStatus).map(([status, data]) =>
            `${this.statusLabel(status as PaymentRequestStatus)}: ${data.count} solicitacoes - ${this.formatCurrency(data.amount)}`
        );
        const blockingLines = summary.blockingReasons.length
            ? summary.blockingReasons.map((item) => `- ${item.reason}: ${item.count}`)
            : ["Nenhum bloqueio registrado."];
        const paymentLines = payments.length
            ? payments.map((payment) => [
                payment.description,
                `Favorecido: ${payment.payeeName}`,
                `Valor: ${this.formatCurrency(payment.amount)}`,
                `Status: ${this.statusLabel(payment.status)}`,
                `Vencimento: ${this.formatDate(payment.dueDate)}`,
                `Bloqueios: ${[...payment.hardBlockingReasons, ...payment.approvalBlockingReasons].join("; ") || "Nenhum"}`
            ].join(" | "))
            : ["Nenhuma solicitacao de pagamento encontrada."];

        return [
            "Resumo geral",
            `Total de solicitacoes: ${summary.totalRequests}`,
            `Total solicitado: ${this.formatCurrency(summary.totalAmount)}`,
            `Pagamentos vencidos: ${summary.overdueCount}`,
            "",
            "Por status",
            ...statusLines,
            "",
            "Principais bloqueios",
            ...blockingLines,
            "",
            "Solicitacoes",
            ...paymentLines
        ].join("\n");
    }

    private buildSpreadsheetReport(summary: Awaited<ReturnType<PaymentRequestService["summary"]>>, payments: Awaited<ReturnType<PaymentRequestService["list"]>>) {
        const rows: Array<Array<string | number>> = [
            ["Resumo", "Valor"],
            ["Total de solicitacoes", summary.totalRequests],
            ["Total solicitado", summary.totalAmount],
            ["Pagamentos vencidos", summary.overdueCount],
            [],
            ["Status", "Quantidade", "Valor"]
        ];

        for (const [status, data] of Object.entries(summary.byStatus)) {
            rows.push([this.statusLabel(status as PaymentRequestStatus), data.count, data.amount]);
        }

        rows.push([], ["Bloqueio", "Quantidade"]);

        if (summary.blockingReasons.length) {
            for (const item of summary.blockingReasons) {
                rows.push([item.reason, item.count]);
            }
        } else {
            rows.push(["Nenhum bloqueio registrado", 0]);
        }

        rows.push([], ["Descricao", "Favorecido", "Valor", "Vencimento", "Status", "Documento", "Bloqueios"]);

        for (const payment of payments) {
            rows.push([
                payment.description,
                payment.payeeName,
                payment.amount,
                this.formatDate(payment.dueDate),
                this.statusLabel(payment.status),
                payment.document?.title || "",
                [...payment.hardBlockingReasons, ...payment.approvalBlockingReasons].join("; ")
            ]);
        }

        return rows.map((row) =>
            row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join("\t")
        ).join("\n");
    }

    private include() {
        return {
            generatedBy: {
                select: { id: true, name: true, email: true, role: true }
            }
        };
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

    private statusLabel(status: PaymentRequestStatus) {
        const labels: Record<PaymentRequestStatus, string> = {
            DRAFT: "Rascunho",
            PENDING_APPROVAL: "Aguardando aprovacoes",
            APPROVED: "Aprovado",
            REJECTED: "Rejeitado",
            PAID: "Pago",
            CANCELED: "Cancelado",
            BLOCKED: "Bloqueado"
        };

        return labels[status];
    }

    private formatCurrency(value: number) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(value || 0);
    }

    private formatDate(value?: string | Date | null) {
        if (!value) return "-";
        return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value));
    }
}
