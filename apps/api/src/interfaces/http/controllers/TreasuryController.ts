import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterTransaction } from '../../../application/usecases/treasury/RegisterTransaction';
import { RegisterRevenue } from '../../../application/usecases/treasury/RegisterRevenue';
import { RegisterExpense } from '../../../application/usecases/treasury/RegisterExpense';
import { ListFinancialAccounts } from '../../../application/usecases/treasury/ListFinancialAccounts';
import { PaymentRequestService } from '../../../application/usecases/treasury/PaymentRequestService';
import { TreasuryReportService } from '../../../application/usecases/treasury/TreasuryReportService';
import { TreasuryReconciliationService } from '../../../application/usecases/treasury/TreasuryReconciliationService';
import {
    createBankStatementEntrySchema,
    createPaymentRequestSchema,
    generateTreasuryReportSchema,
    ignoreBankStatementEntrySchema,
    listBankStatementEntriesSchema,
    listReconciliationCandidatesSchema,
    listTreasuryReportsSchema,
    listPaymentRequestsSchema,
    paymentApprovalSchema,
    payPaymentRequestSchema,
    reconcileBankStatementEntrySchema,
    RegisterTransactionDTO,
    updatePaymentRequestComplianceSchema
} from '../dtos/TreasuryDTOs';

export class TreasuryController {
    constructor(
        private registerTransaction: RegisterTransaction,
        private registerRevenue: RegisterRevenue,
        private registerExpense: RegisterExpense,
        private listAccounts: ListFinancialAccounts,
        private paymentRequests: PaymentRequestService,
        private treasuryReports: TreasuryReportService,
        private reconciliation: TreasuryReconciliationService
    ) { }

    // Generic Register
    async register(request: FastifyRequest<{ Body: RegisterTransactionDTO }>, reply: FastifyReply) {
        return this.handleTransaction(this.registerTransaction, request, reply);
    }

    async createRevenue(request: FastifyRequest<{ Body: RegisterTransactionDTO }>, reply: FastifyReply) {
        return this.handleTransaction(this.registerRevenue, request, reply);
    }

    async createExpense(request: FastifyRequest<{ Body: RegisterTransactionDTO }>, reply: FastifyReply) {
        return this.handleTransaction(this.registerExpense, request, reply);
    }

    async list(request: FastifyRequest, reply: FastifyReply) {
        const associationId = request.headers['x-association-id'] as string;
        if (!associationId) return reply.status(400).send({ error: 'Association ID is required' });

        try {
            const accounts = await this.listAccounts.execute(associationId);
            return reply.send(accounts);
        } catch (error: any) {
            return reply.status(500).send({ error: error.message });
        }
    }

    async createPaymentRequest(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createPaymentRequestSchema.parse(request.body);
            const paymentRequest = await this.paymentRequests.create(data, this.actorId(request));

            return reply.status(201).send(paymentRequest);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async listPaymentRequests(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = listPaymentRequestsSchema.parse(request.query);
            const associationId = query.associationId || (request.headers['x-association-id'] as string | undefined);
            const payments = await this.paymentRequests.list({
                ...query,
                associationId
            });

            return reply.send(payments);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async getPaymentRequest(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.paymentRequests.getById(request.params.id));
        } catch (error: any) {
            return reply.status(404).send({ error: error.message });
        }
    }

    async summarizePaymentRequests(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = listPaymentRequestsSchema.pick({
                associationId: true,
                accountabilityProjectId: true
            }).parse(request.query);
            const associationId = query.associationId || (request.headers['x-association-id'] as string | undefined);

            return reply.send(await this.paymentRequests.summary({
                ...query,
                associationId
            }));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async regularizePaymentRequest(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = updatePaymentRequestComplianceSchema.parse(request.body || {});
            const payment = await this.paymentRequests.updateCompliance(request.params.id, data, this.actorId(request));

            return reply.send(payment);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async approvePaymentRequest(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = paymentApprovalSchema.parse(request.body);
            const payment = await this.paymentRequests.approve(request.params.id, data, this.actorId(request));

            return reply.send(payment);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async rejectPaymentRequest(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = paymentApprovalSchema.parse(request.body);
            const payment = await this.paymentRequests.reject(request.params.id, data, this.actorId(request));

            return reply.send(payment);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async payPaymentRequest(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = payPaymentRequestSchema.parse(request.body || {});
            const payment = await this.paymentRequests.pay(request.params.id, data, this.actorId(request));

            return reply.send(payment);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async getPaymentRequestBlocks(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.paymentRequests.getBlockingReasons(request.params.id));
        } catch (error: any) {
            return reply.status(404).send({ error: error.message });
        }
    }

    async generatePaymentSummaryPdf(request: FastifyRequest, reply: FastifyReply) {
        return this.generatePaymentSummaryReport(request, reply, "PAYMENT_SUMMARY_PDF");
    }

    async generatePaymentSummaryXls(request: FastifyRequest, reply: FastifyReply) {
        return this.generatePaymentSummaryReport(request, reply, "PAYMENT_SUMMARY_XLS");
    }

    async listTreasuryReports(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = listTreasuryReportsSchema.parse(request.query);
            const associationId = query.associationId || (request.headers['x-association-id'] as string | undefined);

            return reply.send(await this.treasuryReports.list({
                ...query,
                associationId
            }));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async downloadTreasuryReport(request: FastifyRequest<{ Params: { fileName: string } }>, reply: FastifyReply) {
        try {
            const stream = await this.treasuryReports.getFileStream(request.params.fileName);

            reply.header("Content-Type", this.treasuryReports.getContentType(request.params.fileName));
            reply.header("Content-Disposition", `attachment; filename="${request.params.fileName}"`);
            return reply.send(stream);
        } catch (error: any) {
            return reply.status(404).send({ error: error.message });
        }
    }

    async createBankStatementEntry(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createBankStatementEntrySchema.parse(request.body);
            const entry = await this.reconciliation.create(data, this.actorId(request));

            return reply.status(201).send(entry);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async listBankStatementEntries(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = listBankStatementEntriesSchema.parse(request.query);
            const associationId = query.associationId || (request.headers['x-association-id'] as string | undefined);

            return reply.send(await this.reconciliation.list({
                ...query,
                associationId
            }));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async summarizeReconciliation(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = listBankStatementEntriesSchema.pick({ associationId: true }).parse(request.query);
            const associationId = query.associationId || (request.headers['x-association-id'] as string | undefined);

            if (!associationId) {
                return reply.status(400).send({ error: "Association ID is required" });
            }

            return reply.send(await this.reconciliation.summary(associationId));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async listReconciliationCandidates(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = listReconciliationCandidatesSchema.parse(request.query);
            const associationId = query.associationId || (request.headers['x-association-id'] as string | undefined);

            return reply.send(await this.reconciliation.listCandidates({
                ...query,
                associationId
            }));
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async reconcileBankStatementEntry(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = reconcileBankStatementEntrySchema.parse(request.body);
            const entry = await this.reconciliation.reconcile(request.params.id, data, this.actorId(request));

            return reply.send(entry);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async unreconcileBankStatementEntry(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const entry = await this.reconciliation.unreconcile(request.params.id, this.actorId(request));

            return reply.send(entry);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    async ignoreBankStatementEntry(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = ignoreBankStatementEntrySchema.parse(request.body || {});
            const entry = await this.reconciliation.ignore(request.params.id, data.reason, this.actorId(request));

            return reply.send(entry);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    private async generatePaymentSummaryReport(
        request: FastifyRequest,
        reply: FastifyReply,
        type: "PAYMENT_SUMMARY_PDF" | "PAYMENT_SUMMARY_XLS"
    ) {
        try {
            const data = generateTreasuryReportSchema.parse(request.body);
            const report = await this.treasuryReports.generatePaymentSummary({
                associationId: data.associationId,
                type,
                performedById: this.actorId(request)
            });

            return reply.status(201).send(report);
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    }

    private async handleTransaction(useCase: any, request: FastifyRequest<{ Body: RegisterTransactionDTO }>, reply: FastifyReply) {
        const associationId = request.headers['x-association-id'] as string;
        const actorId = this.actorId(request) || 'system';

        if (!associationId) {
            return reply.status(400).send({ error: 'Association ID is required' });
        }

        try {
            const entry = await useCase.execute(request.body, associationId, actorId);
            return reply.status(201).send(entry);
        } catch (error: any) {
            if (error.message.includes('obrigatório')) {
                return reply.status(400).send({ error: error.message });
            }
            return reply.status(400).send({ error: error.message });
        }
    }

    private actorId(request: FastifyRequest) {
        return request.headers['x-user-id'] as string | undefined;
    }
}
