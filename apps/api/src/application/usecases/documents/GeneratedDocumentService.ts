import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { GeneratedDocumentType, PrismaClient } from "@prisma/client";
import { PdfGeneratorService } from "../../../domain/services/PdfGeneratorService";

interface OfficialLetterInput {
    associationId: string;
    generatedById?: string;
    referenceId?: string;
    title: string;
    recipient: string;
    subject: string;
    content: string;
}

interface ListGeneratedDocumentsFilters {
    associationId?: string;
    type?: GeneratedDocumentType;
}

export class GeneratedDocumentService {
    private readonly storageDir = path.resolve(process.cwd(), "storage", "generated-documents");

    constructor(
        private readonly prisma: PrismaClient,
        private readonly pdfService: PdfGeneratorService
    ) { }

    async generateAssemblyMinute(assemblyId: string, generatedById?: string) {
        const assembly = await this.prisma.assembly.findUnique({
            where: { id: assemblyId },
            include: {
                association: true,
                attendances: {
                    include: { member: true },
                    orderBy: { createdAt: "asc" }
                },
                deliberations: {
                    orderBy: { createdAt: "asc" }
                },
                chairMember: true,
                secretaryMember: true
            }
        });

        if (!assembly) {
            throw new Error("Assembly not found");
        }

        const [activeMembers, activeMandates] = await Promise.all([
            this.prisma.member.findMany({
                where: { associationId: assembly.associationId, status: "ACTIVE" },
                orderBy: { fullName: "asc" }
            }),
            this.prisma.mandate.findMany({
                where: { associationId: assembly.associationId, isActive: true },
                include: { member: true },
                orderBy: { role: "asc" }
            })
        ]);

        const president =
            assembly.chairMember?.fullName ||
            activeMandates.find((mandate) => mandate.role === "DIRECTOR_PRESIDENT")?.member.fullName ||
            activeMandates.find((mandate) => mandate.role === "PRESIDENT")?.member.fullName ||
            "Presidente em exercicio";
        const secretary =
            assembly.secretaryMember?.fullName ||
            activeMandates.find((mandate) => mandate.role === "SECRETARY")?.member.fullName ||
            "Secretario ad hoc";
        const agenda = assembly.agendaItemIds.length > 0 ? assembly.agendaItemIds : ["Pauta nao informada"];
        const presentPeople = assembly.attendances.length > 0
            ? assembly.attendances.map((attendance) => attendance.member?.fullName || attendance.externalName || "Participante")
            : activeMembers.map((member) => `${member.fullName} - CPF ${member.cpf}`);
        const deliberations = assembly.deliberations.length > 0
            ? assembly.deliberations.map((item, index) => `${index + 1}. ${item.agendaItem}: ${item.decision} (${item.result})`)
            : ["Os itens da ordem do dia foram registrados para controle institucional, prestacao de contas e auditoria."];

        const content = [
            `ATA DA ASSEMBLEIA ${assembly.type}`,
            "",
            `Associacao: ${assembly.association.name}`,
            `Data da assembleia: ${this.formatDate(assembly.date)}`,
            `Data de convocacao: ${assembly.callDate ? this.formatDate(assembly.callDate) : this.formatDate(assembly.createdAt)}`,
            `Status: ${assembly.status}`,
            `Quorum: ${assembly.presentVotingMembers ?? presentPeople.length} presentes com direito a voto de ${assembly.totalVotingMembers ?? activeMembers.length} associados aptos.`,
            `Chamada: ${assembly.heldCallNumber ? `${assembly.heldCallNumber}a chamada` : "Nao informada"}`,
            "",
            "Ordem do dia:",
            ...agenda.map((item, index) => `${index + 1}. ${item}`),
            "",
            "Deliberacoes:",
            ...deliberations,
            "",
            "Participantes:",
            ...presentPeople.map((person, index) => `${index + 1}. ${person}`),
            "",
            "Assinaturas:",
            "",
            "________________________________________",
            `${president}`,
            "Presidente",
            "",
            "________________________________________",
            `${secretary}`,
            "Secretario(a)"
        ].join("\n");

        return this.persistGeneratedDocument({
            associationId: assembly.associationId,
            type: GeneratedDocumentType.ATA,
            referenceId: assembly.id,
            title: `Ata de Assembleia - ${assembly.association.name}`,
            content,
            generatedById
        });
    }

    async generatePresenceList(assemblyId: string, generatedById?: string) {
        const assembly = await this.prisma.assembly.findUnique({
            where: { id: assemblyId },
            include: {
                association: true,
                attendances: {
                    include: { member: true },
                    orderBy: { createdAt: "asc" }
                }
            }
        });

        if (!assembly) {
            throw new Error("Assembly not found");
        }

        const members = await this.prisma.member.findMany({
            where: { associationId: assembly.associationId, status: "ACTIVE" },
            orderBy: { fullName: "asc" }
        });
        const people = assembly.attendances.length > 0
            ? assembly.attendances.map((attendance) => ({
                name: attendance.member?.fullName || attendance.externalName || "Participante",
                cpf: attendance.member?.cpf
            }))
            : members.map((member) => ({ name: member.fullName, cpf: member.cpf }));

        const content = [
            "LISTA DE PRESENCA",
            "",
            `Associacao: ${assembly.association.name}`,
            `Assembleia: ${assembly.type}`,
            `Data: ${this.formatDate(assembly.date)}`,
            "",
            "Assinaturas:",
            ...people.flatMap((person, index) => [
                "",
                `${index + 1}. ________________________________________`,
                `${person.name}`,
                person.cpf ? `CPF: ${person.cpf}` : "Participante externo"
            ]),
            "",
            assembly.attendances.length > 0
                ? "Lista gerada com base nas presencas registradas na assembleia."
                : "Lista gerada com base nos membros ativos da associacao no momento da emissao."
        ].join("\n");

        return this.persistGeneratedDocument({
            associationId: assembly.associationId,
            type: GeneratedDocumentType.LISTA_PRESENCA,
            referenceId: assembly.id,
            title: `Lista de Presenca - ${assembly.association.name}`,
            content,
            generatedById
        });
    }

    async generateStatute(associationId: string, generatedById?: string) {
        const association = await this.prisma.association.findUnique({
            where: { id: associationId },
            include: {
                activeStatute: {
                    include: {
                        versions: {
                            orderBy: { versionNumber: "desc" },
                            take: 1
                        }
                    }
                },
                mandates: {
                    where: { isActive: true },
                    include: { member: true },
                    orderBy: { role: "asc" }
                }
            }
        });

        if (!association) {
            throw new Error("Association not found");
        }

        const statuteContent = association.activeStatute?.versions[0]?.content || "Estatuto ativo nao cadastrado no sistema.";
        const board = association.mandates.length > 0
            ? association.mandates.map((mandate) => `${mandate.role}: ${mandate.member.fullName} desde ${this.formatDate(mandate.startDate)}`)
            : ["Nao ha mandatos ativos cadastrados."];

        const content = [
            "ESTATUTO CONSOLIDADO",
            "",
            `Associacao: ${association.name}`,
            `CNPJ: ${association.cnpj}`,
            `Fundacao: ${this.formatDate(association.foundationDate)}`,
            "",
            "Diretoria e mandatos vigentes:",
            ...board,
            "",
            "Conteudo estatutario consolidado:",
            statuteContent
        ].join("\n");

        return this.persistGeneratedDocument({
            associationId,
            type: GeneratedDocumentType.ESTATUTO,
            referenceId: association.activeStatuteId || associationId,
            title: `Estatuto Consolidado - ${association.name}`,
            content,
            generatedById
        });
    }

    async generateOfficialLetter(input: OfficialLetterInput) {
        const association = await this.prisma.association.findUnique({
            where: { id: input.associationId }
        });

        if (!association) {
            throw new Error("Association not found");
        }

        const content = [
            input.title.toUpperCase(),
            "",
            `Associacao: ${association.name}`,
            `CNPJ: ${association.cnpj}`,
            `Destinatario: ${input.recipient}`,
            `Assunto: ${input.subject}`,
            `Data: ${this.formatDate(new Date())}`,
            "",
            input.content,
            "",
            "Atenciosamente,",
            "",
            "________________________________________",
            association.name
        ].join("\n");

        return this.persistGeneratedDocument({
            associationId: input.associationId,
            type: GeneratedDocumentType.OFICIO,
            referenceId: input.referenceId,
            title: input.title,
            content,
            generatedById: input.generatedById
        });
    }

    async generateFiscalOpinion(projectId: string, generatedById?: string) {
        const project = await this.prisma.accountabilityProject.findUnique({
            where: { id: projectId },
            include: {
                association: true,
                documents: true,
                fiscalOpinions: {
                    orderBy: { signedAt: "desc" },
                    take: 1
                }
            }
        });

        if (!project) {
            throw new Error("Accountability project not found");
        }

        const council = await this.prisma.council.findFirst({
            where: { associationId: project.associationId, type: "FISCAL" },
            include: { members: true }
        });

        const opinion = project.fiscalOpinions[0];
        const content = [
            "PARECER DO CONSELHO FISCAL",
            "",
            `Associacao: ${project.association.name}`,
            `Projeto: ${project.name}`,
            `Concedente: ${project.grantor}`,
            `Instrumento: ${project.instrumentType}${project.instrumentNumber ? ` - ${project.instrumentNumber}` : ""}`,
            `Periodo: ${this.formatDate(project.periodStart)} a ${this.formatDate(project.periodEnd)}`,
            `Status da prestacao: ${project.status}`,
            "",
            "Conselho Fiscal:",
            ...(council?.members.length ? council.members.map((member) => `${member.role}: ${member.userId}`) : ["Conselho Fiscal nao cadastrado."]),
            "",
            "Documentos vinculados:",
            ...(project.documents.length ? project.documents.map((document) => `${document.type}: ${document.validated ? "validado" : "pendente"}`) : ["Nenhum documento vinculado."]),
            "",
            "Parecer:",
            opinion ? `${opinion.opinion} em ${this.formatDate(opinion.signedAt)}` : "Parecer ainda nao registrado.",
            opinion?.notes ? `Observacoes: ${opinion.notes}` : ""
        ].filter(Boolean).join("\n");

        return this.persistGeneratedDocument({
            associationId: project.associationId,
            type: GeneratedDocumentType.PARECER_FISCAL,
            referenceId: project.id,
            title: `Parecer Fiscal - ${project.name}`,
            content,
            generatedById
        });
    }

    async list(filters: ListGeneratedDocumentsFilters = {}) {
        return this.prisma.generatedDocument.findMany({
            where: {
                associationId: filters.associationId,
                type: filters.type
            },
            orderBy: { createdAt: "desc" }
        });
    }

    async getById(id: string) {
        return this.prisma.generatedDocument.findUnique({
            where: { id }
        });
    }

    getAbsoluteFilePath(id: string) {
        return path.join(this.storageDir, `${id}.pdf`);
    }

    private async persistGeneratedDocument(input: {
        associationId: string;
        type: GeneratedDocumentType;
        referenceId?: string | null;
        title: string;
        content: string;
        generatedById?: string;
    }) {
        const generatedById = await this.ensureActor(input.associationId, input.generatedById);
        const id = randomUUID();
        const pdfBuffer = await this.pdfService.generate({
            title: input.title,
            content: input.content,
            footerText: "Gerado digitalmente pelo INSTITUI+"
        });
        const hash = createHash("sha256").update(pdfBuffer).digest("hex");
        const fileUrl = `/documents/generated/${id}/download`;

        await mkdir(this.storageDir, { recursive: true });
        await writeFile(this.getAbsoluteFilePath(id), pdfBuffer);

        const generatedDocument = await this.prisma.generatedDocument.create({
            data: {
                id,
                associationId: input.associationId,
                type: input.type,
                referenceId: input.referenceId,
                title: input.title,
                fileUrl,
                hash,
                generatedById
            }
        });

        await this.prisma.auditLog.create({
            data: {
                associationId: input.associationId,
                entity: "GeneratedDocument",
                entityId: id,
                action: "CREATE",
                performedById: generatedById,
                metadata: {
                    type: input.type,
                    referenceId: input.referenceId,
                    fileUrl,
                    hash
                }
            }
        });

        return generatedDocument;
    }

    private async ensureActor(associationId: string, generatedById?: string) {
        if (generatedById) {
            const user = await this.prisma.user.findUnique({ where: { id: generatedById } });

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
