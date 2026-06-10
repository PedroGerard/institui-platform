import { IAssemblyRepository } from "../../../domain/repositories/Interfaces";
import { IAssociationRepository } from "../../../domain/repositories/Interfaces";
import { DocumentTemplateService } from "../../../domain/services/DocumentTemplateService";
import { PdfGeneratorService } from "../../../domain/services/PdfGeneratorService";
import { UniqueEntityID } from "../../../domain/shared/Entity";

export class GenerateMinutesPDF {
    constructor(
        private assemblyRepository: IAssemblyRepository,
        private associationRepository: IAssociationRepository,
        private templateService: DocumentTemplateService,
        private pdfService: PdfGeneratorService
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

        // Mock data for Secretary/President (logic would be fetching from Mandates/Attendance)
        const secretaryName = "Secretário Ad Hoc";
        const presidentName = "Presidente em Exercício";

        const textContent = this.templateService.generateMinutes({
            associationName: association.name,
            assemblyType: assembly.type,
            date: assembly.date,
            topics: assembly.agendaItemIds, // Simplification: IDs are texts for now? Or catch actual content
            secretaryName: secretaryName,
            presidentName: presidentName
        });

        const pdfBuffer = await this.pdfService.generate({
            title: `ATA DE ASSEMBLEIA - ${association.name}`,
            content: textContent,
            footerText: "Gerado digitalmente por Institui+"
        });

        return pdfBuffer;
    }
}
