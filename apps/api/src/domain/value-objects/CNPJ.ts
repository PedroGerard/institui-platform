
export class CNPJ {
    public readonly value: string;

    private constructor(value: string) {
        this.value = value;
    }

    public static create(cnpj: string): CNPJ {
        const cleaned = cnpj.replace(/[^\d]+/g, '');

        if (cleaned.length !== 14) {
            throw new Error("Invalid CNPJ length");
        }

        if (/^(\d)\1{13}$/.test(cleaned)) {
            throw new Error("Invalid CNPJ");
        }

        if (!CNPJ.isChecksumValid(cleaned)) {
            throw new Error("Invalid CNPJ checksum");
        }

        return new CNPJ(cleaned);
    }

    public getFormatted(): string {
        return this.value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    private static isChecksumValid(value: string): boolean {
        const calculateDigit = (length: number) => {
            const weights = length === 12
                ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
                : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

            const sum = value
                .slice(0, length)
                .split('')
                .reduce((total, digit, index) => total + Number(digit) * weights[index], 0);

            const remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        };

        return calculateDigit(12) === Number(value[12]) && calculateDigit(13) === Number(value[13]);
    }
}
