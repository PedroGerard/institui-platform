export interface MinutesData {
    associationName: string;
    assemblyType: string;
    date: Date;
    topics: string[];
    secretaryName: string;
    presidentName: string;
}

export class DocumentTemplateService {
    formatDate(date: Date): string {
        return date.toLocaleDateString('pt-BR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    }

    generateMinutes(data: MinutesData): string {
        return `
ATA DA ASSEMBLEIA GERAL ${data.assemblyType.toUpperCase()} DA ${data.associationName.toUpperCase()}

Aos ${this.formatDate(data.date)}, reuniram-se os associados da ${data.associationName}, com a seguinte ordem do dia:

${data.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

DELIBERAÇÕES:

Após leitura da ordem do dia, foram debatidos e aprovados os itens acima descritos. Nada mais havendo a tratar, foi lavrada a presente ata, que vai assinada por mim, ${data.secretaryName}, secretário(a), e pelo(a) presidente ${data.presidentName}.

_________________________
${data.presidentName}
Presidente

_________________________
${data.secretaryName}
Secretário(a)
        `;
    }

    generatePresenceList(associationName: string, date: Date, memberNames: string[]): string {
        return `
LISTA DE PRESENÇA - ASSEMBLEIA GERAL
${associationName.toUpperCase()}
Data: ${this.formatDate(date)}

ASSINATURAS:

${memberNames.map((name, i) => `${i + 1}. __________________________________________________\n    ${name}\n`).join('\n')}
        `;
    }
}
