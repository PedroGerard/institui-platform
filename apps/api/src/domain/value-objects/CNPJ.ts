
export class CNPJ {
    public readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(cnpj: string): CNPJ {
        // Basic format validation (placeholder for full algorithm)
        const cleaned = cnpj.replace(/[^\d]+/g, '');

        if (cleaned.length !== 14) {
            throw new Error("Invalid CNPJ length");
        }

        // TODO: Implement checksum validation
        return new CNPJ(cleaned);
    }

    public getFormatted(): string {
        return this.value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
}
