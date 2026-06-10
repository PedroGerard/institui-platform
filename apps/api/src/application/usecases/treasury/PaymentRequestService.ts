import {
    AuditAction,
    PaymentApprovalDecision,
    PaymentApprovalRole,
    PaymentRequestStatus,
    Prisma,
    PrismaClient
} from "@prisma/client";
import {
    CreatePaymentRequestDTO,
    PaymentApprovalDTO,
    PayPaymentRequestDTO,
    UpdatePaymentRequestComplianceDTO
} from "../../../interfaces/http/dtos/TreasuryDTOs";

const REQUIRED_SIGNATORY_ROLES: PaymentApprovalRole[] = [
    PaymentApprovalRole.DIRECTOR_PRESIDENT,
    PaymentApprovalRole.ADMINISTRATIVE_FINANCIAL_DIRECTOR
];

const ALLOWED_APPROVAL_ROLES = [
    PaymentApprovalRole.DIRECTOR_PRESIDENT,
    PaymentApprovalRole.ADMINISTRATIVE_FINANCIAL_DIRECTOR,
    PaymentApprovalRole.TECHNICAL_DIRECTOR,
    PaymentApprovalRole.FISCAL_COUNCIL,
    PaymentApprovalRole.OTHER
];

export class PaymentRequestService {
    constructor(private readonly prisma: PrismaClient) { }

    async create(input: CreatePaymentRequestDTO, performedById?: string) {
        await this.assertAssociation(input.associationId);
        await this.assertAccount(input.associationId, input.debitAccountId, "Conta de debito invalida.");
        await this.assertAccount(input.associationId, input.creditAccountId, "Conta de credito invalida.");

        if (input.documentId) {
            await this.assertDocument(input.associationId, input.documentId);
        }

        if (input.accountabilityProjectId) {
            await this.assertAccountabilityProject(input.associationId, input.accountabilityProjectId);
        }

        if (input.fundId) {
            await this.assertFund(input.associationId, input.fundId);
        }

        if (input.procurementContractId) {
            await this.assertProcurementContract(input.associationId, input.procurementContractId);
        }

        const hardBlockingReasons = this.calculateHardBlockingReasons({
            documentId: input.documentId,
            requiresContract: input.requiresContract ?? false,
            contractFileUrl: input.contractFileUrl,
            requiresNegativeCertificate: input.requiresNegativeCertificate ?? false,
            negativeCertificateExpiresAt: input.negativeCertificateExpiresAt ? new Date(input.negativeCertificateExpiresAt) : null
        });

        const request = await this.prisma.paymentRequest.create({
            data: {
                associationId: input.associationId,
                requestedById: await this.optionalActor(input.associationId, performedById),
                accountabilityProjectId: input.accountabilityProjectId,
                documentId: input.documentId,
                fundId: input.fundId,
                procurementContractId: input.procurementContractId,
                debitAccountId: input.debitAccountId,
                creditAccountId: input.creditAccountId,
                payeeName: input.payeeName,
                description: input.description,
                amount: input.amount,
                dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
                status: hardBlockingReasons.length ? PaymentRequestStatus.BLOCKED : PaymentRequestStatus.PENDING_APPROVAL,
                requiresContract: input.requiresContract ?? false,
                contractFileUrl: input.contractFileUrl,
                requiresNegativeCertificate: input.requiresNegativeCertificate ?? false,
                negativeCertificateExpiresAt: input.negativeCertificateExpiresAt ? new Date(input.negativeCertificateExpiresAt) : undefined
            },
            include: this.include()
        });

        await this.audit({
            associationId: input.associationId,
            entity: "PaymentRequest",
            entityId: request.id,
            action: AuditAction.CREATE,
            performedById,
            metadata: {
                amount: String(request.amount),
                payeeName: request.payeeName,
                status: request.status,
                hardBlockingReasons
            }
        });

        return this.toDTO(request);
    }

    async list(filters: {
        associationId?: string;
        status?: PaymentRequestStatus;
        accountabilityProjectId?: string;
    } = {}) {
        const requests = await this.prisma.paymentRequest.findMany({
            where: {
                associationId: filters.associationId,
                status: filters.status,
                accountabilityProjectId: filters.accountabilityProjectId
            },
            include: this.include(),
            orderBy: [
                { dueDate: "asc" },
                { createdAt: "desc" }
            ]
        });

        return requests.map((request) => this.toDTO(request));
    }

    async getById(id: string) {
        const request = await this.prisma.paymentRequest.findUnique({
            where: { id },
            include: this.include()
        });

        if (!request) {
            throw new Error("Solicitacao de pagamento nao encontrada.");
        }

        return this.toDTO(request);
    }

    async summary(filters: {
        associationId?: string;
        accountabilityProjectId?: string;
    } = {}) {
        const requests = await this.prisma.paymentRequest.findMany({
            where: {
                associationId: filters.associationId,
                accountabilityProjectId: filters.accountabilityProjectId
            },
            include: this.include()
        });
        const byStatus = Object.values(PaymentRequestStatus).reduce((acc, status) => {
            acc[status] = {
                count: 0,
                amount: 0
            };
            return acc;
        }, {} as Record<PaymentRequestStatus, { count: number; amount: number }>);
        const blockingReasonMap = new Map<string, number>();
        const today = new Date();
        let totalAmount = 0;
        let overdueCount = 0;

        for (const request of requests) {
            const amount = Number(request.amount);
            totalAmount += amount;
            byStatus[request.status].count += 1;
            byStatus[request.status].amount += amount;

            const closedStatuses: PaymentRequestStatus[] = [PaymentRequestStatus.PAID, PaymentRequestStatus.CANCELED];

            if (request.dueDate && request.dueDate < today && !closedStatuses.includes(request.status)) {
                overdueCount += 1;
            }

            const reasons = [
                ...this.calculateHardBlockingReasons(request),
                ...this.calculateApprovalBlockingReasons(request)
            ];

            for (const reason of reasons) {
                blockingReasonMap.set(reason, (blockingReasonMap.get(reason) || 0) + 1);
            }
        }

        return {
            totalRequests: requests.length,
            totalAmount,
            overdueCount,
            byStatus,
            blockingReasons: [...blockingReasonMap.entries()]
                .map(([reason, count]) => ({ reason, count }))
                .sort((a, b) => b.count - a.count)
        };
    }

    async updateCompliance(id: string, input: UpdatePaymentRequestComplianceDTO, performedById?: string) {
        const request = await this.getRawById(id);

        const closedStatuses: PaymentRequestStatus[] = [PaymentRequestStatus.PAID, PaymentRequestStatus.CANCELED];

        if (closedStatuses.includes(request.status)) {
            throw new Error("Pagamento baixado ou cancelado nao pode ser regularizado.");
        }

        if (input.documentId) {
            await this.assertDocument(request.associationId, input.documentId);
        }

        if (input.accountabilityProjectId) {
            await this.assertAccountabilityProject(request.associationId, input.accountabilityProjectId);
        }

        if (input.fundId) {
            await this.assertFund(request.associationId, input.fundId);
        }

        if (input.procurementContractId) {
            await this.assertProcurementContract(request.associationId, input.procurementContractId);
        }

        const updated = await this.prisma.paymentRequest.update({
            where: { id },
            data: {
                accountabilityProjectId: input.accountabilityProjectId,
                documentId: input.documentId,
                fundId: input.fundId,
                procurementContractId: input.procurementContractId,
                requiresContract: input.requiresContract,
                contractFileUrl: input.contractFileUrl,
                requiresNegativeCertificate: input.requiresNegativeCertificate,
                negativeCertificateExpiresAt: input.negativeCertificateExpiresAt ? new Date(input.negativeCertificateExpiresAt) : undefined
            },
            include: this.include()
        });
        const nextStatus = updated.status === PaymentRequestStatus.REJECTED
            ? PaymentRequestStatus.REJECTED
            : this.resolveStatusFromRequest(updated);
        const regularized = await this.prisma.paymentRequest.update({
            where: { id },
            data: { status: nextStatus },
            include: this.include()
        });

        await this.audit({
            associationId: request.associationId,
            entity: "PaymentRequest",
            entityId: id,
            action: AuditAction.UPDATE,
            performedById,
            metadata: {
                previousStatus: request.status,
                status: regularized.status,
                hardBlockingReasons: this.calculateHardBlockingReasons(regularized),
                approvalBlockingReasons: this.calculateApprovalBlockingReasons(regularized)
            }
        });

        return this.toDTO(regularized);
    }

    async approve(id: string, input: PaymentApprovalDTO, performedById?: string) {
        if (!ALLOWED_APPROVAL_ROLES.includes(input.role)) {
            throw new Error("Papel de aprovacao invalido.");
        }

        const request = await this.getRawById(id);
        this.assertCanReceiveApproval(request.status);
        const actorId = await this.ensureActor(request.associationId, input.approvedById || performedById);

        await this.prisma.paymentApproval.upsert({
            where: {
                paymentRequestId_approvedById: {
                    paymentRequestId: id,
                    approvedById: actorId
                }
            },
            update: {
                role: input.role,
                decision: PaymentApprovalDecision.APPROVED,
                notes: input.notes
            },
            create: {
                paymentRequestId: id,
                approvedById: actorId,
                role: input.role,
                decision: PaymentApprovalDecision.APPROVED,
                notes: input.notes
            }
        });

        const updatedStatus = await this.resolveCurrentStatus(id);
        const updated = await this.prisma.paymentRequest.update({
            where: { id },
            data: { status: updatedStatus },
            include: this.include()
        });

        await this.audit({
            associationId: request.associationId,
            entity: "PaymentRequest",
            entityId: id,
            action: AuditAction.APPROVE,
            performedById: actorId,
            metadata: { role: input.role, status: updated.status }
        });

        return this.toDTO(updated);
    }

    async reject(id: string, input: PaymentApprovalDTO, performedById?: string) {
        const request = await this.getRawById(id);
        this.assertCanReceiveApproval(request.status);
        const actorId = await this.ensureActor(request.associationId, input.approvedById || performedById);

        const updated = await this.prisma.$transaction(async (tx) => {
            await tx.paymentApproval.upsert({
                where: {
                    paymentRequestId_approvedById: {
                        paymentRequestId: id,
                        approvedById: actorId
                    }
                },
                update: {
                    role: input.role,
                    decision: PaymentApprovalDecision.REJECTED,
                    notes: input.notes
                },
                create: {
                    paymentRequestId: id,
                    approvedById: actorId,
                    role: input.role,
                    decision: PaymentApprovalDecision.REJECTED,
                    notes: input.notes
                }
            });

            return tx.paymentRequest.update({
                where: { id },
                data: { status: PaymentRequestStatus.REJECTED },
                include: this.include()
            });
        });

        await this.audit({
            associationId: request.associationId,
            entity: "PaymentRequest",
            entityId: id,
            action: AuditAction.REJECT,
            performedById: actorId,
            metadata: { role: input.role, status: updated.status, notes: input.notes }
        });

        return this.toDTO(updated);
    }

    async pay(id: string, input: PayPaymentRequestDTO, performedById?: string) {
        const request = await this.getRawById(id);
        const blockingReasons = this.calculatePaymentBlockingReasons(request);

        if (blockingReasons.length > 0) {
            throw new Error(`Pagamento bloqueado: ${blockingReasons.join("; ")}`);
        }

        const actorId = await this.ensureActor(request.associationId, performedById);
        const paidAt = input.paidAt ? new Date(input.paidAt) : new Date();

        const updated = await this.prisma.$transaction(async (tx) => {
            const entry = await tx.financialEntry.create({
                data: {
                    associationId: request.associationId,
                    date: paidAt,
                    description: request.description,
                    amount: request.amount,
                    debitAccountId: request.debitAccountId,
                    creditAccountId: request.creditAccountId,
                    documentId: request.documentId,
                    fundId: request.fundId,
                    actorId,
                    activityType: input.activityType,
                    paymentRequestId: request.id
                }
            });

            return tx.paymentRequest.update({
                where: { id },
                data: {
                    status: PaymentRequestStatus.PAID,
                    paidAt
                },
                include: this.include()
            });
        });

        await this.audit({
            associationId: request.associationId,
            entity: "PaymentRequest",
            entityId: id,
            action: AuditAction.UPDATE,
            performedById: actorId,
            metadata: {
                status: PaymentRequestStatus.PAID,
                amount: String(request.amount),
                payeeName: request.payeeName
            }
        });

        return this.toDTO(updated);
    }

    async getBlockingReasons(id: string) {
        const request = await this.getRawById(id);

        return {
            id,
            hardBlockingReasons: this.calculateHardBlockingReasons(request),
            approvalBlockingReasons: this.calculateApprovalBlockingReasons(request),
            paymentBlockingReasons: this.calculatePaymentBlockingReasons(request)
        };
    }

    private async resolveCurrentStatus(id: string) {
        const request = await this.getRawById(id);

        return this.resolveStatusFromRequest(request);
    }

    private resolveStatusFromRequest(request: Awaited<ReturnType<PaymentRequestService["getRawById"]>>) {
        const hardBlockingReasons = this.calculateHardBlockingReasons(request);

        if (hardBlockingReasons.length > 0) {
            return PaymentRequestStatus.BLOCKED;
        }

        if (this.calculateApprovalBlockingReasons(request).length === 0) {
            return PaymentRequestStatus.APPROVED;
        }

        return PaymentRequestStatus.PENDING_APPROVAL;
    }

    private calculateHardBlockingReasons(input: {
        documentId?: string | null;
        requiresContract?: boolean | null;
        contractFileUrl?: string | null;
        requiresNegativeCertificate?: boolean | null;
        negativeCertificateExpiresAt?: Date | null;
    }) {
        const reasons: string[] = [];

        if (!input.documentId) {
            reasons.push("Documento habil ausente");
        }

        if (input.requiresContract && !input.contractFileUrl) {
            reasons.push("Contrato obrigatorio ausente");
        }

        if (input.requiresNegativeCertificate) {
            if (!input.negativeCertificateExpiresAt) {
                reasons.push("Certidao negativa obrigatoria ausente");
            } else if (input.negativeCertificateExpiresAt < new Date()) {
                reasons.push("Certidao negativa vencida");
            }
        }

        return reasons;
    }

    private calculateApprovalBlockingReasons(request: Awaited<ReturnType<PaymentRequestService["getRawById"]>>) {
        const reasons: string[] = [];
        const approved = request.approvals.filter((approval) => approval.decision === PaymentApprovalDecision.APPROVED);
        const distinctApprovers = new Set(approved.map((approval) => approval.approvedById));

        if (distinctApprovers.size < 2) {
            reasons.push("Duas aprovacoes distintas sao obrigatorias");
        }

        if (!approved.some((approval) => REQUIRED_SIGNATORY_ROLES.includes(approval.role))) {
            reasons.push("Assinatura do Diretor Presidente ou Diretor Administrativo-Financeiro obrigatoria");
        }

        if (request.approvals.some((approval) => approval.decision === PaymentApprovalDecision.REJECTED)) {
            reasons.push("Solicitacao possui rejeicao registrada");
        }

        return reasons;
    }

    private calculatePaymentBlockingReasons(request: Awaited<ReturnType<PaymentRequestService["getRawById"]>>) {
        const reasons = [
            ...this.calculateHardBlockingReasons(request),
            ...this.calculateApprovalBlockingReasons(request)
        ];

        if (request.status === PaymentRequestStatus.PAID) {
            reasons.push("Pagamento ja baixado");
        }

        if (request.status === PaymentRequestStatus.CANCELED) {
            reasons.push("Solicitacao cancelada");
        }

        if (request.status === PaymentRequestStatus.REJECTED) {
            reasons.push("Solicitacao rejeitada");
        }

        if (request.status !== PaymentRequestStatus.APPROVED) {
            reasons.push("Solicitacao ainda nao esta aprovada");
        }

        return [...new Set(reasons)];
    }

    private async getRawById(id: string) {
        const request = await this.prisma.paymentRequest.findUnique({
            where: { id },
            include: this.include()
        });

        if (!request) {
            throw new Error("Solicitacao de pagamento nao encontrada.");
        }

        return request;
    }

    private async assertAssociation(associationId: string) {
        const association = await this.prisma.association.findUnique({ where: { id: associationId } });

        if (!association) {
            throw new Error("Associacao nao encontrada.");
        }
    }

    private async assertAccount(associationId: string, accountId: string, message: string) {
        const account = await this.prisma.financialAccount.findUnique({ where: { id: accountId } });

        if (!account || account.associationId !== associationId || !account.isAnalytic) {
            throw new Error(message);
        }
    }

    private async assertDocument(associationId: string, documentId: string) {
        const document = await this.prisma.document.findUnique({ where: { id: documentId } });

        if (!document || document.associationId !== associationId) {
            throw new Error("Documento habil nao pertence a associacao.");
        }
    }

    private async assertAccountabilityProject(associationId: string, projectId: string) {
        const project = await this.prisma.accountabilityProject.findUnique({ where: { id: projectId } });

        if (!project || project.associationId !== associationId) {
            throw new Error("Projeto de prestacao nao pertence a associacao.");
        }
    }

    private async assertFund(associationId: string, fundId: string) {
        const fund = await this.prisma.fund.findUnique({ where: { id: fundId } });

        if (!fund || fund.associationId !== associationId) {
            throw new Error("Fundo nao pertence a associacao.");
        }
    }

    private async assertProcurementContract(associationId: string, contractId: string) {
        const contract = await this.prisma.procurementContract.findUnique({ where: { id: contractId } });

        if (!contract || contract.associationId !== associationId) {
            throw new Error("Contrato MROSC nao pertence a associacao.");
        }
    }

    private assertCanReceiveApproval(status: PaymentRequestStatus) {
        const closedStatuses: PaymentRequestStatus[] = [PaymentRequestStatus.PAID, PaymentRequestStatus.CANCELED];

        if (closedStatuses.includes(status)) {
            throw new Error("Solicitacao nao pode mais receber aprovacao.");
        }
    }

    private include() {
        return {
            requestedBy: {
                select: { id: true, name: true, email: true, role: true }
            },
            accountabilityProject: {
                select: { id: true, name: true, status: true, instrumentNumber: true }
            },
            document: {
                select: { id: true, title: true, type: true, status: true }
            },
            fund: {
                select: { id: true, name: true, restricted: true }
            },
            procurementContract: {
                select: {
                    id: true,
                    contractNumber: true,
                    title: true,
                    amount: true,
                    status: true,
                    supplier: {
                        select: { id: true, name: true, cnpj: true }
                    }
                }
            },
            debitAccount: {
                select: { id: true, code: true, name: true, type: true }
            },
            creditAccount: {
                select: { id: true, code: true, name: true, type: true }
            },
            financialEntry: true,
            approvals: {
                include: {
                    approvedBy: {
                        select: { id: true, name: true, email: true, role: true }
                    }
                },
                orderBy: { createdAt: "asc" as const }
            }
        };
    }

    private toDTO(request: any) {
        return {
            ...request,
            amount: Number(request.amount),
            hardBlockingReasons: this.calculateHardBlockingReasons(request),
            approvalBlockingReasons: this.calculateApprovalBlockingReasons(request),
            paymentBlockingReasons: this.calculatePaymentBlockingReasons(request)
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

    private async optionalActor(associationId: string, performedById?: string) {
        if (!performedById) {
            return undefined;
        }

        return this.ensureActor(associationId, performedById);
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
}
