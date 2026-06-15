export type FinancialAccount = {
    id: string;
    code: string;
    name: string;
    type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
    nature?: 'DEBIT' | 'CREDIT';
    parentId?: string | null;
    isAnalytic: boolean;
    level?: number;
    children?: FinancialAccount[];
};
