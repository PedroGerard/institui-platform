import { FastifyReply, FastifyRequest } from "fastify";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import {
    AccountabilityStatus,
    DocumentType,
    FiscalOpinionType,
    InstrumentType,
    ReportType
} from "@prisma/client";
import { z } from "zod";
import { AccountabilityService } from "../../../application/usecases/accountability/AccountabilityService";
import { PdfGeneratorService } from "../../../domain/services/PdfGeneratorService";
import { prisma } from "../../../infrastructure/database/prisma";

const dateFromString = z.string().transform((value) => new Date(value));
const emptyToUndefined = z.string().optional().transform((value) => value || undefined);

const createProjectSchema = z.object({
    associationId: z.string().uuid(),
    name: z.string().min(3),
    grantor: z.string().min(2),
    instrumentType: z.nativeEnum(InstrumentType),
    instrumentNumber: emptyToUndefined,
    periodStart: dateFromString,
    periodEnd: dateFromString,
    bankAccountId: emptyToUndefined
});

const listProjectQuerySchema = z.object({
    associationId: z.string().uuid().optional(),
    status: z.nativeEnum(AccountabilityStatus).optional(),
    instrumentType: z.nativeEnum(InstrumentType).optional(),
    year: z.string().optional().transform((value) => value ? Number(value) : undefined)
});

const statusSchema = z.object({
    status: z.nativeEnum(AccountabilityStatus)
});

const documentSchema = z.object({
    type: z.nativeEnum(DocumentType),
    fileUrl: z.string().min(1),
    isRequired: z.boolean().optional()
});

const validateDocumentSchema = z.object({
    validated: z.boolean()
});

const fiscalOpinionSchema = z.object({
    councilUserId: z.string().uuid(),
    opinion: z.nativeEnum(FiscalOpinionType),
    notes: z.string().optional()
});

export class AccountabilityController {
    private static service() {
        return new AccountabilityService(prisma, new PdfGeneratorService());
    }

    private static performedBy(req: FastifyRequest) {
        return req.headers["x-user-id"] as string | undefined;
    }

    static async createProject(req: FastifyRequest, reply: FastifyReply) {
        try {
            const data = createProjectSchema.parse(req.body);
            const project = await this.service().createProject({
                ...data,
                performedById: this.performedBy(req)
            });

            return reply.status(201).send(project);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async listProjects(req: FastifyRequest, reply: FastifyReply) {
        try {
            const filters = listProjectQuerySchema.parse(req.query);
            const projects = await this.service().listProjects(filters);

            return reply.send(projects);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async getProject(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.service().getProject(req.params.id));
        } catch (err: any) {
            return reply.status(404).send({ error: err.message });
        }
    }

    static async updateStatus(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = statusSchema.parse(req.body);
            const project = await this.service().updateStatus(req.params.id, data.status, this.performedBy(req));

            return reply.send(project);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async uploadDocument(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = documentSchema.parse(req.body);
            const document = await this.service().uploadDocument(req.params.id, {
                ...data,
                performedById: this.performedBy(req)
            });

            return reply.status(201).send(document);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async listDocuments(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.service().listDocuments(req.params.id));
        } catch (err: any) {
            return reply.status(404).send({ error: err.message });
        }
    }

    static async validateDocument(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = validateDocumentSchema.parse(req.body);
            const document = await this.service().validateDocument(req.params.id, data.validated, this.performedBy(req));

            return reply.send(document);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async checklist(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.service().generateChecklist(req.params.id));
        } catch (err: any) {
            return reply.status(404).send({ error: err.message });
        }
    }

    static async registerFiscalOpinion(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const data = fiscalOpinionSchema.parse(req.body);
            const opinion = await this.service().registerFiscalOpinion(req.params.id, data);

            return reply.status(201).send(opinion);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async listFiscalOpinions(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.service().listFiscalOpinions(req.params.id));
        } catch (err: any) {
            return reply.status(404).send({ error: err.message });
        }
    }

    static async generatePdfReport(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const report = await this.service().generateReport(req.params.id, ReportType.PDF, this.performedBy(req));

            return reply.status(201).send(report);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async generateXlsReport(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const report = await this.service().generateReport(req.params.id, ReportType.XLS, this.performedBy(req));

            return reply.status(201).send(report);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async listReports(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            return reply.send(await this.service().listReports(req.params.id));
        } catch (err: any) {
            return reply.status(404).send({ error: err.message });
        }
    }

    static async submitProject(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const project = await this.service().submitProject(req.params.id, this.performedBy(req));

            return reply.send(project);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async downloadReport(req: FastifyRequest<{ Params: { fileName: string } }>, reply: FastifyReply) {
        try {
            const filePath = this.service().getReportFilePath(`/accountability/reports/${req.params.fileName}/download`);
            await access(filePath);

            reply.header("Content-Type", req.params.fileName.endsWith(".pdf") ? "application/pdf" : "application/vnd.ms-excel");
            reply.header("Content-Disposition", `attachment; filename="${req.params.fileName}"`);
            return reply.send(createReadStream(filePath));
        } catch (err: any) {
            return reply.status(404).send({ error: err.message });
        }
    }
}
