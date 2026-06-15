import { PrismaClient } from "@prisma/client";
import { IAssemblyRepository, IAssociationRepository } from "../../../domain/repositories/Interfaces";
import { DocumentTemplateService } from "../../../domain/services/DocumentTemplateService";
import { PdfGeneratorService } from "../../../domain/services/PdfGeneratorService";
import { UniqueEntityID } from "../../../domain/shared/Entity";

export class GenerateMinutesPDF {
    constructor(
        private assemblyRepository: IAssemblyRepository,
        private associationRepository: IAssociationRepository,
        private templateService: DocumentTemplateService,
        private pdfService: PdfGeneratorService,
        private prisma?: PrismaClient
    ) { }

    async execute(assemblyId: string): Promise<Buffer> {
        const assembly = await this.assemblyRepository.findById(new UniqueEntityID(assemblyId));
        if (!assembly) {
            throw new Error('Assembly not found');
        }

        const association = await this.associationRepository.findById(assembly.associationId);
        if (!association) {
            throw new Error('Association not found');
        }

        const secretaryName = await this.memberNameOrRole(
            assembly.props.secretaryMemberId?.toString(),
            'Secretario(a) da assembleia'
        );
        const presidentName = await this.memberNameOrRole(
            assembly.props.chairMemberId?.toString(),
            'Presidente da assembleia'
        );

        const textContent = this.templateService.generateMinutes({
            associationName: association.name,
            assemblyType: assembly.type,
            date: assembly.date,
            topics: assembly.agendaItemIds,
            secretaryName,
            presidentName
        });

        return this.pdfService.generate({
            title: `ATA DE ASSEMBLEIA - ${association.name}`,
            content: textContent,
            footerText: "Gerado digitalmente por Institui+"
        });
    }

    private async memberNameOrRole(memberId: string | undefined, fallback: string) {
        if (!memberId || !this.prisma) return fallback;

        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            select: { fullName: true }
        });

        return member?.fullName || fallback;
    }
}
