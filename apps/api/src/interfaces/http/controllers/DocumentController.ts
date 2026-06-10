import { FastifyReply, FastifyRequest } from 'fastify';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { GeneratedDocumentType } from '@prisma/client';
import { z } from 'zod';
import { GeneratedDocumentService } from '../../../application/usecases/documents/GeneratedDocumentService';
import { GenerateMinutesPDF } from '../../../application/usecases/documents/GenerateMinutesPDF';
import { PrismaAssemblyRepository } from '../../../infrastructure/database/PrismaAssemblyRepository';
import { PrismaAssociationRepository } from '../../../infrastructure/database/PrismaAssociationRepository';
import { DocumentTemplateService } from '../../../domain/services/DocumentTemplateService';
import { PdfGeneratorService } from '../../../domain/services/PdfGeneratorService';
import { prisma } from '../../../infrastructure/database/prisma';

const officialLetterSchema = z.object({
    associationId: z.string().uuid(),
    generatedById: z.string().uuid().optional(),
    referenceId: z.string().optional(),
    title: z.string().min(3),
    recipient: z.string().min(2),
    subject: z.string().min(2),
    content: z.string().min(10)
});

const generatedDocumentQuerySchema = z.object({
    associationId: z.string().uuid().optional(),
    type: z.nativeEnum(GeneratedDocumentType).optional()
});

export class DocumentController {
    private static generatedDocumentService() {
        return new GeneratedDocumentService(prisma, new PdfGeneratorService());
    }

    private static generatedBy(req: FastifyRequest) {
        return req.headers['x-user-id'] as string | undefined;
    }

    static async downloadMinutes(req: FastifyRequest<{ Params: { assemblyId: string } }>, reply: FastifyReply) {
        const { assemblyId } = req.params;

        const assemblyRepo = new PrismaAssemblyRepository(prisma);
        const associationRepo = new PrismaAssociationRepository(prisma);
        const templateService = new DocumentTemplateService();
        const pdfService = new PdfGeneratorService();

        const useCase = new GenerateMinutesPDF(
            assemblyRepo,
            associationRepo,
            templateService,
            pdfService
        );

        try {
            const buffer = await useCase.execute(assemblyId);

            reply.header('Content-Type', 'application/pdf');
            reply.header('Content-Disposition', `attachment; filename="ata_${assemblyId}.pdf"`);
            return reply.send(buffer);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async generateAssemblyMinute(req: FastifyRequest<{ Params: { assemblyId: string } }>, reply: FastifyReply) {
        try {
            const document = await this.generatedDocumentService().generateAssemblyMinute(
                req.params.assemblyId,
                this.generatedBy(req)
            );

            return reply.status(201).send(document);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async generatePresenceList(req: FastifyRequest<{ Params: { assemblyId: string } }>, reply: FastifyReply) {
        try {
            const document = await this.generatedDocumentService().generatePresenceList(
                req.params.assemblyId,
                this.generatedBy(req)
            );

            return reply.status(201).send(document);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async generateStatute(req: FastifyRequest<{ Params: { associationId: string } }>, reply: FastifyReply) {
        try {
            const document = await this.generatedDocumentService().generateStatute(
                req.params.associationId,
                this.generatedBy(req)
            );

            return reply.status(201).send(document);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async generateOfficialLetter(req: FastifyRequest, reply: FastifyReply) {
        try {
            const body = officialLetterSchema.parse(req.body);
            const document = await this.generatedDocumentService().generateOfficialLetter({
                ...body,
                generatedById: body.generatedById || this.generatedBy(req)
            });

            return reply.status(201).send(document);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async generateFiscalOpinion(req: FastifyRequest<{ Params: { projectId: string } }>, reply: FastifyReply) {
        try {
            const document = await this.generatedDocumentService().generateFiscalOpinion(
                req.params.projectId,
                this.generatedBy(req)
            );

            return reply.status(201).send(document);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async listGenerated(req: FastifyRequest, reply: FastifyReply) {
        try {
            const query = generatedDocumentQuerySchema.parse(req.query);
            const documents = await this.generatedDocumentService().list(query);

            return reply.send(documents);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async getGeneratedById(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const document = await this.generatedDocumentService().getById(req.params.id);

            if (!document) {
                return reply.status(404).send({ error: "Generated document not found" });
            }

            return reply.send(document);
        } catch (err: any) {
            return reply.status(400).send({ error: err.message });
        }
    }

    static async downloadGenerated(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        try {
            const service = this.generatedDocumentService();
            const document = await service.getById(req.params.id);

            if (!document) {
                return reply.status(404).send({ error: "Generated document not found" });
            }

            const filePath = service.getAbsoluteFilePath(document.id);
            await access(filePath);

            reply.header('Content-Type', 'application/pdf');
            reply.header('Content-Disposition', `attachment; filename="${document.id}.pdf"`);
            return reply.send(createReadStream(filePath));
        } catch (err: any) {
            return reply.status(404).send({ error: err.message });
        }
    }
}
