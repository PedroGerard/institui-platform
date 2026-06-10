import {
    AuditAction,
    Prisma,
    PrismaClient,
    ProcurementContractStatus,
    ProcurementDocumentType,
    ProcurementProcessStatus,
    SupplierProposalStatus
} from "@prisma/client";
import {
    AddProcurementItemDTO,
    CreateProcurementContractDTO,
    CreateProcurementProcessDTO,
    CreateSupplierDTO,
    CreateSupplierProposalDTO,
    ListProcurementProcessesDTO,
    ListSuppliersDTO
} from "../../../interfaces/http/dtos/ProcurementDTOs";

export class ProcurementService {
    constructor(private readonly prisma: PrismaClient) { }

    async createSupplier(input: CreateSupplierDTO, performedById?: string) {
        const supplier = await this.prisma.supplier.upsert({
            where: {
                associationId_cnpj: {
                    associationId: input.associationId,
                    cnpj: input.cnpj
                }
            },
            update: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                address: input.address
            },
            create: input
        });

        await this.audit({
            associationId: input.associationId,
            entity: "Supplier",
            entityId: supplier.id,
            action: AuditAction.CREATE,
            performedById,
            metadata: { cnpj: supplier.cnpj, name: supplier.name }
        });

        return supplier;
    }

    async listSuppliers(filters: ListSuppliersDTO) {
        return this.prisma.supplier.findMany({
            where: {
                associationId: filters.associationId,
                OR: filters.search
                    ? [
                        { name: { contains: filters.search, mode: "insensitive" } },
                        { cnpj: { contains: filters.search, mode: "insensitive" } }
                    ]
                    : undefined
            },
            orderBy: { name: "asc" }
        });
    }

    async createProcess(input: CreateProcurementProcessDTO, performedById?: string) {
        if (new Date(input.proposalEndDate) < new Date(input.proposalStartDate)) {
            throw new Error("Data final das propostas deve ser posterior ao inicio.");
        }

        const actorId = await this.optionalActor(input.associationId, performedById);
        const process = await this.prisma.procurementProcess.create({
            data: {
                associationId: input.associationId,
                accountabilityProjectId: input.accountabilityProjectId,
                title: input.title,
                noticeNumber: input.noticeNumber,
                instrumentNumber: input.instrumentNumber,
                object: input.object,
                justification: input.justification,
                judgmentCriterion: input.judgmentCriterion,
                proposalStartDate: input.proposalStartDate,
                proposalEndDate: input.proposalEndDate,
                openingDate: input.openingDate,
                publicationUrl: input.publicationUrl,
                contactName: input.contactName,
                contactEmail: input.contactEmail,
                contactPhone: input.contactPhone,
                createdById: actorId,
                status: ProcurementProcessStatus.NOTICE_PREPARED,
                documents: {
                    create: {
                        type: ProcurementDocumentType.EDITAL_COTACAO_PREVIA,
                        title: `Edital de Cotacao Previa ${input.noticeNumber}`,
                        generatedById: actorId
                    }
                }
            },
            include: this.processInclude()
        });

        await this.audit({
            associationId: input.associationId,
            entity: "ProcurementProcess",
            entityId: process.id,
            action: AuditAction.CREATE,
            performedById: actorId,
            metadata: {
                noticeNumber: process.noticeNumber,
                status: process.status
            }
        });

        return this.toProcessDTO(process);
    }

    async listProcesses(filters: ListProcurementProcessesDTO) {
        const processes = await this.prisma.procurementProcess.findMany({
            where: {
                associationId: filters.associationId,
                accountabilityProjectId: filters.accountabilityProjectId,
                status: filters.status
            },
            include: this.processInclude(),
            orderBy: { createdAt: "desc" }
        });

        return processes.map((process) => this.toProcessDTO(process));
    }

    async getProcess(id: string) {
        const process = await this.prisma.procurementProcess.findUnique({
            where: { id },
            include: this.processInclude()
        });

        if (!process) {
            throw new Error("Processo de compra nao encontrado.");
        }

        return this.toProcessDTO(process);
    }

    async addItem(processId: string, input: AddProcurementItemDTO, performedById?: string) {
        const process = await this.getRawProcess(processId);
        this.assertEditable(process.status);

        const item = await this.prisma.procurementItem.create({
            data: {
                processId,
                description: input.description,
                unit: input.unit,
                quantity: input.quantity,
                estimatedUnitPrice: input.estimatedUnitPrice
            }
        });

        await this.audit({
            associationId: process.associationId,
            entity: "ProcurementItem",
            entityId: item.id,
            action: AuditAction.CREATE,
            performedById,
            metadata: {
                processId,
                description: item.description,
                quantity: this.decimalToNumber(item.quantity)
            }
        });

        return this.toItemDTO(item);
    }

    async createProposal(processId: string, input: CreateSupplierProposalDTO, performedById?: string) {
        const process = await this.getRawProcess(processId);
        const supplier = await this.prisma.supplier.findUnique({ where: { id: input.supplierId } });

        if (!supplier || supplier.associationId !== process.associationId) {
            throw new Error("Fornecedor invalido para esta associacao.");
        }

        if (!process.items.length) {
            throw new Error("Inclua ao menos um item antes de registrar propostas.");
        }

        const itemIds = new Set(process.items.map((item) => item.id));
        for (const quotedItem of input.items) {
            if (!itemIds.has(quotedItem.itemId)) {
                throw new Error("Proposta contem item que nao pertence ao processo.");
            }
        }

        const proposal = await this.prisma.supplierProposal.upsert({
            where: {
                processId_supplierId: {
                    processId,
                    supplierId: input.supplierId
                }
            },
            update: {
                validUntil: input.validUntil,
                notes: input.notes,
                status: SupplierProposalStatus.RECEIVED,
                items: {
                    deleteMany: {},
                    create: this.buildQuoteItems(process.items, input)
                }
            },
            create: {
                processId,
                supplierId: input.supplierId,
                validUntil: input.validUntil,
                notes: input.notes,
                items: {
                    create: this.buildQuoteItems(process.items, input)
                }
            },
            include: this.proposalInclude()
        });

        await this.prisma.procurementProcess.update({
            where: { id: processId },
            data: { status: ProcurementProcessStatus.QUOTATION_OPEN }
        });

        await this.audit({
            associationId: process.associationId,
            entity: "SupplierProposal",
            entityId: proposal.id,
            action: AuditAction.CREATE,
            performedById,
            metadata: {
                processId,
                supplierId: input.supplierId,
                quotedItems: input.items.length
            }
        });

        return this.toProposalDTO(proposal);
    }

    async priceMap(processId: string) {
        const process = await this.getRawProcess(processId);
        const rows = process.items.map((item) => {
            const quotes = process.proposals
                .flatMap((proposal) => proposal.items.map((quote) => ({
                    id: quote.id,
                    itemId: quote.itemId,
                    proposalId: proposal.id,
                    supplierId: proposal.supplierId,
                    supplierName: proposal.supplier.name,
                    supplierCnpj: proposal.supplier.cnpj,
                    unitPrice: this.decimalToNumber(quote.unitPrice),
                    totalPrice: this.decimalToNumber(quote.totalPrice),
                    status: proposal.status
                })))
                .filter((quote) => quote.itemId === item.id);

            const activeQuotes = quotes.filter((quote) => quote.status !== SupplierProposalStatus.DISQUALIFIED);
            const winner = activeQuotes.length
                ? [...activeQuotes].sort((a, b) => a.unitPrice - b.unitPrice || a.totalPrice - b.totalPrice)[0]
                : null;

            return {
                item: this.toItemDTO(item),
                quotes,
                winner,
                hasMinimumQuotes: activeQuotes.length >= 3
            };
        });

        const pendingItems = rows.filter((row) => !row.winner).length;
        const itemsBelowThreeQuotes = rows.filter((row) => !row.hasMinimumQuotes).length;
        const totalEstimated = rows.reduce((sum, row) => sum + ((row.item.estimatedUnitPrice || 0) * row.item.quantity), 0);
        const totalWinning = rows.reduce((sum, row) => sum + (row.winner?.totalPrice || 0), 0);

        return {
            processId,
            totalItems: rows.length,
            pendingItems,
            itemsBelowThreeQuotes,
            totalEstimated,
            totalWinning,
            canSelectSuppliers: rows.length > 0 && pendingItems === 0,
            rows
        };
    }

    async selectSuppliers(processId: string, performedById?: string) {
        const process = await this.getRawProcess(processId);
        const map = await this.priceMap(processId);

        if (!map.canSelectSuppliers) {
            throw new Error("Mapa de precos incompleto. Todos os itens precisam ter proposta vencedora.");
        }

        const winnerSupplierIds = new Set(map.rows
            .map((row) => row.winner?.supplierId)
            .filter(Boolean) as string[]);

        await this.prisma.$transaction([
            this.prisma.supplierProposal.updateMany({
                where: { processId },
                data: { status: SupplierProposalStatus.RECEIVED }
            }),
            this.prisma.supplierProposal.updateMany({
                where: {
                    processId,
                    supplierId: { in: Array.from(winnerSupplierIds) }
                },
                data: { status: SupplierProposalStatus.SELECTED }
            }),
            this.prisma.procurementProcess.update({
                where: { id: processId },
                data: {
                    status: ProcurementProcessStatus.SUPPLIERS_SELECTED,
                    documents: {
                        createMany: {
                            data: [
                                {
                                    type: ProcurementDocumentType.MAPA_PRECOS,
                                    title: `Mapa de Precos ${process.noticeNumber}`,
                                    generatedById: performedById
                                },
                                {
                                    type: ProcurementDocumentType.ATA_SELECAO_FORNECEDORES,
                                    title: `Ata de Selecao de Fornecedores ${process.noticeNumber}`,
                                    generatedById: performedById
                                }
                            ]
                        }
                    }
                }
            })
        ]);

        await this.audit({
            associationId: process.associationId,
            entity: "ProcurementProcess",
            entityId: processId,
            action: AuditAction.APPROVE,
            performedById,
            metadata: {
                status: ProcurementProcessStatus.SUPPLIERS_SELECTED,
                winnerSupplierIds: Array.from(winnerSupplierIds)
            }
        });

        return this.getProcess(processId);
    }

    async homologate(processId: string, performedById?: string) {
        const process = await this.getRawProcess(processId);

        if (process.status !== ProcurementProcessStatus.SUPPLIERS_SELECTED) {
            throw new Error("A homologacao exige fornecedores selecionados.");
        }

        await this.prisma.procurementProcess.update({
            where: { id: processId },
            data: {
                status: ProcurementProcessStatus.HOMOLOGATED,
                documents: {
                    create: {
                        type: ProcurementDocumentType.HOMOLOGACAO_FORNECEDOR,
                        title: `Homologacao de Selecao de Fornecedor ${process.noticeNumber}`,
                        generatedById: performedById
                    }
                }
            }
        });

        await this.audit({
            associationId: process.associationId,
            entity: "ProcurementProcess",
            entityId: processId,
            action: AuditAction.APPROVE,
            performedById,
            metadata: { status: ProcurementProcessStatus.HOMOLOGATED }
        });

        return this.getProcess(processId);
    }

    async createContract(processId: string, input: CreateProcurementContractDTO, performedById?: string) {
        const process = await this.getRawProcess(processId);

        const allowedContractStatuses: ProcurementProcessStatus[] = [
            ProcurementProcessStatus.HOMOLOGATED,
            ProcurementProcessStatus.CONTRACTED
        ];

        if (!allowedContractStatuses.includes(process.status)) {
            throw new Error("Contrato so pode ser registrado apos homologacao.");
        }

        const selectedProposal = process.proposals.find((proposal) =>
            proposal.supplierId === input.supplierId && proposal.status === SupplierProposalStatus.SELECTED
        );

        if (!selectedProposal) {
            throw new Error("Fornecedor precisa estar selecionado no processo antes do contrato.");
        }

        const contract = await this.prisma.procurementContract.create({
            data: {
                associationId: process.associationId,
                processId,
                supplierId: input.supplierId,
                contractNumber: input.contractNumber,
                title: input.title,
                amount: input.amount,
                startDate: input.startDate,
                endDate: input.endDate,
                fileUrl: input.fileUrl,
                status: ProcurementContractStatus.ACTIVE
            },
            include: {
                supplier: true,
                process: true
            }
        });

        await this.prisma.procurementProcess.update({
            where: { id: processId },
            data: {
                status: ProcurementProcessStatus.CONTRACTED,
                documents: {
                    create: {
                        type: ProcurementDocumentType.CONTRATO,
                        title: input.title,
                        fileUrl: input.fileUrl,
                        generatedById: performedById
                    }
                }
            }
        });

        await this.audit({
            associationId: process.associationId,
            entity: "ProcurementContract",
            entityId: contract.id,
            action: AuditAction.CREATE,
            performedById,
            metadata: {
                processId,
                supplierId: input.supplierId,
                contractNumber: contract.contractNumber,
                amount: this.decimalToNumber(contract.amount)
            }
        });

        return {
            ...contract,
            amount: this.decimalToNumber(contract.amount)
        };
    }

    private async getRawProcess(id: string) {
        const process = await this.prisma.procurementProcess.findUnique({
            where: { id },
            include: this.processInclude()
        });

        if (!process) {
            throw new Error("Processo de compra nao encontrado.");
        }

        return process;
    }

    private buildQuoteItems(items: Awaited<ReturnType<ProcurementService["getRawProcess"]>>["items"], input: CreateSupplierProposalDTO) {
        return input.items.map((quote) => {
            const item = items.find((candidate) => candidate.id === quote.itemId);

            if (!item) {
                throw new Error("Item cotado nao encontrado no processo.");
            }

            const quantity = this.decimalToNumber(item.quantity);

            return {
                itemId: quote.itemId,
                unitPrice: quote.unitPrice,
                totalPrice: quote.unitPrice * quantity
            };
        });
    }

    private assertEditable(status: ProcurementProcessStatus) {
        const closedStatuses: ProcurementProcessStatus[] = [
            ProcurementProcessStatus.HOMOLOGATED,
            ProcurementProcessStatus.CONTRACTED,
            ProcurementProcessStatus.CANCELED
        ];

        if (closedStatuses.includes(status)) {
            throw new Error("Processo ja encerrado para edicao de itens.");
        }
    }

    private processInclude() {
        return {
            accountabilityProject: true,
            items: {
                include: {
                    quotes: true
                },
                orderBy: { createdAt: "asc" as const }
            },
            proposals: {
                include: this.proposalInclude(),
                orderBy: { submittedAt: "desc" as const }
            },
            documents: {
                orderBy: { createdAt: "desc" as const }
            },
            contracts: {
                include: { supplier: true },
                orderBy: { createdAt: "desc" as const }
            }
        };
    }

    private proposalInclude() {
        return {
            supplier: true,
            items: {
                include: {
                    item: true
                }
            }
        };
    }

    private toProcessDTO(process: Awaited<ReturnType<ProcurementService["getRawProcess"]>>) {
        return {
            ...process,
            items: process.items.map((item) => this.toItemDTO(item)),
            proposals: process.proposals.map((proposal) => this.toProposalDTO(proposal)),
            contracts: process.contracts.map((contract) => ({
                ...contract,
                amount: this.decimalToNumber(contract.amount)
            }))
        };
    }

    private toItemDTO(item: {
        id: string;
        processId: string;
        description: string;
        unit: string | null;
        quantity: Prisma.Decimal;
        estimatedUnitPrice: Prisma.Decimal | null;
        createdAt: Date;
        updatedAt: Date;
    }) {
        return {
            ...item,
            quantity: this.decimalToNumber(item.quantity),
            estimatedUnitPrice: item.estimatedUnitPrice ? this.decimalToNumber(item.estimatedUnitPrice) : null
        };
    }

    private toProposalDTO(proposal: {
        id: string;
        processId: string;
        supplierId: string;
        status: SupplierProposalStatus;
        submittedAt: Date;
        validUntil: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        supplier: {
            id: string;
            associationId: string;
            name: string;
            cnpj: string;
            email: string | null;
            phone: string | null;
            address: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        items: Array<{
            id: string;
            proposalId: string;
            itemId: string;
            unitPrice: Prisma.Decimal;
            totalPrice: Prisma.Decimal;
            createdAt: Date;
            updatedAt: Date;
            item?: unknown;
        }>;
    }) {
        return {
            ...proposal,
            items: proposal.items.map((item) => ({
                ...item,
                unitPrice: this.decimalToNumber(item.unitPrice),
                totalPrice: this.decimalToNumber(item.totalPrice)
            }))
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
        if (!performedById) return undefined;
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

    private decimalToNumber(value: Prisma.Decimal) {
        return Number(value.toString());
    }
}
