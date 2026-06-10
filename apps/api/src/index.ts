
import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { PrismaAssemblyRepository } from "./infrastructure/database/PrismaAssemblyRepository.js";
import { PrismaAssociationRepository } from "./infrastructure/database/PrismaAssociationRepository.js";
import { PrismaStatuteRepository } from "./infrastructure/database/PrismaStatuteRepository.js";
import { PrismaDocumentRepository } from "./infrastructure/database/PrismaDocumentRepository.js";
import { CallAssemblyUseCase } from "./application/use-cases/CallAssembly.js";
import { HoldAssemblyUseCase } from "./application/use-cases/HoldAssembly.js";
import { RegisterMinutesUseCase } from "./application/use-cases/RegisterMinutes.js";
import { CallAssemblyController } from "./interfaces/http/controllers/CallAssemblyController.js";
import { HoldAssemblyController } from "./interfaces/http/controllers/HoldAssemblyController.js";
import { RegisterMinutesController } from "./interfaces/http/controllers/RegisterMinutesController.js";
import { LegalEventController } from "./interfaces/http/controllers/LegalEventController.js";
import { AssemblyController } from "./interfaces/http/controllers/AssemblyController.js";

import { AssociationStatusController } from "./interfaces/http/controllers/AssociationStatusController.js";

process.env.DATABASE_URL ||= "postgresql://institui:institui@localhost:5432/institui";

const server = Fastify({ logger: true });

// --- DI Container (Poor man's) ---
const prisma = new PrismaClient();
const assemblyRepo = new PrismaAssemblyRepository(prisma);
const associationRepo = new PrismaAssociationRepository(prisma);
const statuteRepo = new PrismaStatuteRepository(prisma);
const documentRepo = new PrismaDocumentRepository(prisma); // Added

const callAssemblyUseCase = new CallAssemblyUseCase(associationRepo, assemblyRepo, statuteRepo);
const callAssemblyController = new CallAssemblyController(callAssemblyUseCase);

const holdAssemblyUseCase = new HoldAssemblyUseCase(assemblyRepo);
const holdAssemblyController = new HoldAssemblyController(holdAssemblyUseCase);

const registerMinutesUseCase = new RegisterMinutesUseCase(assemblyRepo, documentRepo);
const registerMinutesController = new RegisterMinutesController(registerMinutesUseCase);

const legalEventController = new LegalEventController(prisma);
const associationStatusController = new AssociationStatusController(prisma);


server.addHook("onRequest", async (request, reply) => {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    reply.header("Access-Control-Allow-Headers", "Content-Type,Authorization,x-association-id,x-user-id");

    if (request.method === "OPTIONS") {
        return reply.status(204).send();
    }
});

// --- Routes ---

server.post("/assemblies/call", async (req, reply) => {
    await callAssemblyController.execute(req, reply);
});

server.get("/assemblies", async (req, reply) => {
    await AssemblyController.list(req, reply);
});

server.get<{ Params: { id: string } }>("/assemblies/:id", async (req, reply) => {
    await AssemblyController.getById(req, reply);
});

server.post("/assemblies/:id/hold", async (req, reply) => {
    await holdAssemblyController.execute(req, reply);
});

server.post("/assemblies/:id/minutes", async (req, reply) => {
    await registerMinutesController.execute(req, reply);
});

server.post<{ Params: { id: string } }>("/assemblies/:id/attendances", async (req, reply) => {
    await AssemblyController.addAttendance(req, reply);
});

server.post<{ Params: { id: string } }>("/assemblies/:id/deliberations", async (req, reply) => {
    await AssemblyController.addDeliberation(req, reply);
});


server.get("/legal-events/:associationId", async (req, reply) => {
    await legalEventController.execute(req, reply);
});


server.get("/association/status/:associationId", async (req, reply) => {
    await associationStatusController.execute(req, reply);
});

// --- Treasury Routes ---
// --- Treasury Routes ---
import { RegisterTransaction } from "./application/usecases/treasury/RegisterTransaction.js";
import { RegisterRevenue } from "./application/usecases/treasury/RegisterRevenue.js";
import { RegisterExpense } from "./application/usecases/treasury/RegisterExpense.js";
import { ListFinancialAccounts } from "./application/usecases/treasury/ListFinancialAccounts.js";
import { PaymentRequestService } from "./application/usecases/treasury/PaymentRequestService.js";
import { TreasuryReportService } from "./application/usecases/treasury/TreasuryReportService.js";
import { TreasuryReconciliationService } from "./application/usecases/treasury/TreasuryReconciliationService.js";
import { TreasuryController } from "./interfaces/http/controllers/TreasuryController.js";
import { RegisterTransactionDTO } from "./interfaces/http/dtos/TreasuryDTOs.js";
import { PdfGeneratorService } from "./domain/services/PdfGeneratorService.js";

const registerTransaction = new RegisterTransaction(prisma);
const registerRevenue = new RegisterRevenue(prisma, registerTransaction);
const registerExpense = new RegisterExpense(prisma, registerTransaction);
const listAccounts = new ListFinancialAccounts(prisma);
const paymentRequestService = new PaymentRequestService(prisma);
const treasuryReportService = new TreasuryReportService(prisma, new PdfGeneratorService(), paymentRequestService);
const treasuryReconciliationService = new TreasuryReconciliationService(prisma);

const treasuryController = new TreasuryController(
    registerTransaction,
    registerRevenue,
    registerExpense,
    listAccounts,
    paymentRequestService,
    treasuryReportService,
    treasuryReconciliationService
);

server.post<{ Body: RegisterTransactionDTO }>("/treasury/transactions", async (req, reply) => {
    await treasuryController.register(req, reply);
});

server.post<{ Body: RegisterTransactionDTO }>("/treasury/revenues", async (req, reply) => {
    await treasuryController.createRevenue(req, reply);
});

server.post<{ Body: RegisterTransactionDTO }>("/treasury/expenses", async (req, reply) => {
    await treasuryController.createExpense(req, reply);
});

server.get("/treasury/accounts", async (req, reply) => {
    await treasuryController.list(req, reply);
});

server.post("/treasury/payment-requests", async (req, reply) => {
    await treasuryController.createPaymentRequest(req, reply);
});

server.get("/treasury/payment-requests", async (req, reply) => {
    await treasuryController.listPaymentRequests(req, reply);
});

server.get("/treasury/payment-requests/summary", async (req, reply) => {
    await treasuryController.summarizePaymentRequests(req, reply);
});

server.get<{ Params: { id: string } }>("/treasury/payment-requests/:id", async (req, reply) => {
    await treasuryController.getPaymentRequest(req, reply);
});

server.get<{ Params: { id: string } }>("/treasury/payment-requests/:id/blocks", async (req, reply) => {
    await treasuryController.getPaymentRequestBlocks(req, reply);
});

server.patch<{ Params: { id: string } }>("/treasury/payment-requests/:id/compliance", async (req, reply) => {
    await treasuryController.regularizePaymentRequest(req, reply);
});

server.post<{ Params: { id: string } }>("/treasury/payment-requests/:id/approve", async (req, reply) => {
    await treasuryController.approvePaymentRequest(req, reply);
});

server.post<{ Params: { id: string } }>("/treasury/payment-requests/:id/reject", async (req, reply) => {
    await treasuryController.rejectPaymentRequest(req, reply);
});

server.post<{ Params: { id: string } }>("/treasury/payment-requests/:id/pay", async (req, reply) => {
    await treasuryController.payPaymentRequest(req, reply);
});

server.post("/treasury/reports/payments/pdf", async (req, reply) => {
    await treasuryController.generatePaymentSummaryPdf(req, reply);
});

server.post("/treasury/reports/payments/xls", async (req, reply) => {
    await treasuryController.generatePaymentSummaryXls(req, reply);
});

server.get("/treasury/reports", async (req, reply) => {
    await treasuryController.listTreasuryReports(req, reply);
});

server.get<{ Params: { fileName: string } }>("/treasury/reports/:fileName/download", async (req, reply) => {
    await treasuryController.downloadTreasuryReport(req, reply);
});

server.post("/treasury/reconciliation/statements", async (req, reply) => {
    await treasuryController.createBankStatementEntry(req, reply);
});

server.get("/treasury/reconciliation/statements", async (req, reply) => {
    await treasuryController.listBankStatementEntries(req, reply);
});

server.get("/treasury/reconciliation/summary", async (req, reply) => {
    await treasuryController.summarizeReconciliation(req, reply);
});

server.get("/treasury/reconciliation/candidates", async (req, reply) => {
    await treasuryController.listReconciliationCandidates(req, reply);
});

server.post<{ Params: { id: string } }>("/treasury/reconciliation/statements/:id/reconcile", async (req, reply) => {
    await treasuryController.reconcileBankStatementEntry(req, reply);
});

server.post<{ Params: { id: string } }>("/treasury/reconciliation/statements/:id/unreconcile", async (req, reply) => {
    await treasuryController.unreconcileBankStatementEntry(req, reply);
});

server.post<{ Params: { id: string } }>("/treasury/reconciliation/statements/:id/ignore", async (req, reply) => {
    await treasuryController.ignoreBankStatementEntry(req, reply);
});

// --- Procurement / MROSC Routes ---
import { ProcurementService } from "./application/usecases/procurement/ProcurementService.js";
import { ProcurementController } from "./interfaces/http/controllers/ProcurementController.js";

const procurementService = new ProcurementService(prisma);
const procurementController = new ProcurementController(procurementService);

server.post("/procurements/suppliers", async (req, reply) => {
    await procurementController.createSupplier(req, reply);
});

server.get("/procurements/suppliers", async (req, reply) => {
    await procurementController.listSuppliers(req, reply);
});

server.post("/procurements", async (req, reply) => {
    await procurementController.createProcess(req, reply);
});

server.get("/procurements", async (req, reply) => {
    await procurementController.listProcesses(req, reply);
});

server.get<{ Params: { id: string } }>("/procurements/:id", async (req, reply) => {
    await procurementController.getProcess(req, reply);
});

server.post<{ Params: { id: string } }>("/procurements/:id/items", async (req, reply) => {
    await procurementController.addItem(req, reply);
});

server.post<{ Params: { id: string } }>("/procurements/:id/proposals", async (req, reply) => {
    await procurementController.createProposal(req, reply);
});

server.get<{ Params: { id: string } }>("/procurements/:id/price-map", async (req, reply) => {
    await procurementController.priceMap(req, reply);
});

server.post<{ Params: { id: string } }>("/procurements/:id/select-suppliers", async (req, reply) => {
    await procurementController.selectSuppliers(req, reply);
});

server.post<{ Params: { id: string } }>("/procurements/:id/homologate", async (req, reply) => {
    await procurementController.homologate(req, reply);
});

server.post<{ Params: { id: string } }>("/procurements/:id/contracts", async (req, reply) => {
    await procurementController.createContract(req, reply);
});



// --- Member Routes ---
import { MemberController } from "./interfaces/http/controllers/MemberController.js";

server.post("/members", async (req, reply) => {
    await MemberController.register(req, reply);
});

server.get("/members", async (req, reply) => {
    await MemberController.list(req, reply);
});

server.get("/members/:id", async (req, reply) => {
    await MemberController.getById(req, reply);
});

server.patch("/members/:id/status", async (req, reply) => {
    await MemberController.updateStatus(req, reply);
});

// --- Mandate Routes ---
import { MandateController } from "./interfaces/http/controllers/MandateController.js";

server.post("/mandates", async (req, reply) => {
    await MandateController.create(req, reply);
});

server.get("/mandates", async (req, reply) => {
    await MandateController.list(req, reply);
});

server.get("/mandates/active", async (req, reply) => {
    await MandateController.listActive(req, reply);
});

server.post("/mandates/:id/close", async (req, reply) => {
    await MandateController.close(req, reply);
});

// --- Election Routes ---
import { ElectionController } from "./interfaces/http/controllers/ElectionController.js";

server.post("/elections", async (req, reply) => {
    await ElectionController.create(req, reply);
});

server.get("/elections", async (req, reply) => {
    await ElectionController.list(req, reply);
});

server.get<{ Params: { id: string } }>("/elections/:id", async (req, reply) => {
    await ElectionController.getById(req, reply);
});

server.post<{ Params: { id: string } }>("/elections/:id/slates", async (req, reply) => {
    await ElectionController.addSlate(req, reply);
});

server.post<{ Params: { slateId: string } }>("/elections/slates/:slateId/candidates", async (req, reply) => {
    await ElectionController.addCandidate(req, reply);
});

server.post<{ Params: { id: string } }>("/elections/:id/approve", async (req, reply) => {
    await ElectionController.approve(req, reply);
});

server.post<{ Params: { id: string } }>("/elections/:id/create-mandates", async (req, reply) => {
    await ElectionController.createMandates(req, reply);
});

// --- Configurable Governance Body Routes ---
import { GovernanceBodyController } from "./interfaces/http/controllers/GovernanceBodyController.js";

server.post("/governance-bodies", async (req, reply) => {
    await GovernanceBodyController.create(req, reply);
});

server.get("/governance-bodies", async (req, reply) => {
    await GovernanceBodyController.list(req, reply);
});

server.get<{ Params: { id: string } }>("/governance-bodies/:id", async (req, reply) => {
    await GovernanceBodyController.getById(req, reply);
});

server.patch<{ Params: { id: string } }>("/governance-bodies/:id", async (req, reply) => {
    await GovernanceBodyController.update(req, reply);
});

server.post<{ Params: { id: string } }>("/governance-bodies/:id/members", async (req, reply) => {
    await GovernanceBodyController.addMember(req, reply);
});

server.post<{ Params: { memberId: string } }>("/governance-bodies/members/:memberId/close", async (req, reply) => {
    await GovernanceBodyController.closeMember(req, reply);
});

// --- Accountability Routes ---
import { AccountabilityController } from "./interfaces/http/controllers/AccountabilityController.js";

server.post("/accountability/projects", async (req, reply) => {
    await AccountabilityController.createProject(req, reply);
});

server.get("/accountability/projects", async (req, reply) => {
    await AccountabilityController.listProjects(req, reply);
});

server.get<{ Params: { id: string } }>("/accountability/projects/:id", async (req, reply) => {
    await AccountabilityController.getProject(req, reply);
});

server.patch<{ Params: { id: string } }>("/accountability/projects/:id/status", async (req, reply) => {
    await AccountabilityController.updateStatus(req, reply);
});

server.post<{ Params: { id: string } }>("/accountability/projects/:id/documents", async (req, reply) => {
    await AccountabilityController.uploadDocument(req, reply);
});

server.get<{ Params: { id: string } }>("/accountability/projects/:id/documents", async (req, reply) => {
    await AccountabilityController.listDocuments(req, reply);
});

server.patch<{ Params: { id: string } }>("/accountability/documents/:id/validate", async (req, reply) => {
    await AccountabilityController.validateDocument(req, reply);
});

server.get<{ Params: { id: string } }>("/accountability/projects/:id/checklist", async (req, reply) => {
    await AccountabilityController.checklist(req, reply);
});

server.post<{ Params: { id: string } }>("/accountability/projects/:id/fiscal-opinion", async (req, reply) => {
    await AccountabilityController.registerFiscalOpinion(req, reply);
});

server.get<{ Params: { id: string } }>("/accountability/projects/:id/fiscal-opinion", async (req, reply) => {
    await AccountabilityController.listFiscalOpinions(req, reply);
});

server.post<{ Params: { id: string } }>("/accountability/projects/:id/reports/pdf", async (req, reply) => {
    await AccountabilityController.generatePdfReport(req, reply);
});

server.post<{ Params: { id: string } }>("/accountability/projects/:id/reports/xls", async (req, reply) => {
    await AccountabilityController.generateXlsReport(req, reply);
});

server.get<{ Params: { id: string } }>("/accountability/projects/:id/reports", async (req, reply) => {
    await AccountabilityController.listReports(req, reply);
});

server.post<{ Params: { id: string } }>("/accountability/projects/:id/submit", async (req, reply) => {
    await AccountabilityController.submitProject(req, reply);
});

server.get<{ Params: { fileName: string } }>("/accountability/reports/:fileName/download", async (req, reply) => {
    await AccountabilityController.downloadReport(req, reply);
});

// --- Document Routes ---
import { DocumentController } from "./interfaces/http/controllers/DocumentController.js";

server.post<{ Params: { assemblyId: string } }>("/documents/generate/assembly-minute/:assemblyId", async (req, reply) => {
    await DocumentController.generateAssemblyMinute(req, reply);
});

server.post<{ Params: { assemblyId: string } }>("/documents/generate/presence-list/:assemblyId", async (req, reply) => {
    await DocumentController.generatePresenceList(req, reply);
});

server.post<{ Params: { associationId: string } }>("/documents/generate/statute/:associationId", async (req, reply) => {
    await DocumentController.generateStatute(req, reply);
});

server.post("/documents/generate/official-letter", async (req, reply) => {
    await DocumentController.generateOfficialLetter(req, reply);
});

server.post<{ Params: { projectId: string } }>("/documents/generate/fiscal-opinion/:projectId", async (req, reply) => {
    await DocumentController.generateFiscalOpinion(req, reply);
});

server.get("/documents/generated", async (req, reply) => {
    await DocumentController.listGenerated(req, reply);
});

server.get<{ Params: { id: string } }>("/documents/generated/:id/download", async (req, reply) => {
    await DocumentController.downloadGenerated(req, reply);
});

server.get<{ Params: { id: string } }>("/documents/generated/:id", async (req, reply) => {
    await DocumentController.getGeneratedById(req, reply);
});

server.get<{ Params: { assemblyId: string } }>("/documents/minutes/:assemblyId", async (req, reply) => {
    await DocumentController.downloadMinutes(req, reply);
});

server.get("/health", async () => {
    return { status: "ok", system: "Institui+ Legal Engine" };
});

const start = async () => {
    try {
        const port = Number(process.env.PORT || 3333);
        await server.listen({ port });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
