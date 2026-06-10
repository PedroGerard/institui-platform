export type FinancialAccount = {
    id: string;
    code: string;
    name: string;
    type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    isAnalytic: boolean; // Assuming this based on user request "isAnalytic: boolean" mentioned in "Correção correta"
    level?: number;
    children?: FinancialAccount[];
};
