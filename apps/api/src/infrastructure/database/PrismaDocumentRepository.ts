
import { IDocumentRepository } from "../../domain/repositories/Interfaces";
import { Document, DocumentStatus } from "../../domain/entities/Document";
import { UniqueEntityID } from "../../domain/shared/Entity";
import { PrismaClient } from "@prisma/client";

export class PrismaDocumentRepository implements IDocumentRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async save(document: Document): Promise<void> {
        const data = {
            id: document.id.toString(),
            associationId: document.props.associationId.toString(),
            title: document.props.title,
            content: document.props.content,
            type: document.props.type,
            status: document.props.status,
            originatingLegalActId: document.props.originatingLegalActId?.toString(),
            md5Hash: document.props.md5Hash
        };

        await this.prisma.document.upsert({
            where: { id: data.id },
            update: data,
            create: data
        });
    }

    async findById(id: UniqueEntityID): Promise<Document | null> {
        const raw = await this.prisma.document.findUnique({
            where: { id: id.toString() }
        });

        if (!raw) return null;

        return Document.create({
            associationId: new UniqueEntityID(raw.associationId),
            title: raw.title,
            content: raw.content,
            type: raw.type,
            status: raw.status as DocumentStatus,
            originatingLegalActId: raw.originatingLegalActId ? new UniqueEntityID(raw.originatingLegalActId) : undefined,
            md5Hash: raw.md5Hash || undefined
        }, new UniqueEntityID(raw.id));
    }
}
