'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';

import { FinancialAccount } from '@/types/financial';

// Mock Data simulating the ITG 2002 structure we seeded
const MOCK_ACCOUNTS: FinancialAccount[] = [
    {
        id: '1', code: '1', name: 'ATIVO', type: 'ASSET', isAnalytic: false, level: 1, children: [
            {
                id: '1.1', code: '1.1', name: 'ATIVO CIRCULANTE', type: 'ASSET', isAnalytic: false, level: 2, children: [
                    {
                        id: '1.1.1', code: '1.1.1', name: 'Disponibilidades', type: 'ASSET', isAnalytic: false, level: 3, children: [
                            { id: '1.1.1.01', code: '1.1.1.01', name: 'Caixa Geral', type: 'ASSET', isAnalytic: true, level: 4 },
                            { id: '1.1.1.02', code: '1.1.1.02', name: 'Bancos Conta Movimento', type: 'ASSET', isAnalytic: true, level: 4 }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: '2', code: '2', name: 'PASSIVO', type: 'LIABILITY', isAnalytic: false, level: 1, children: [
            {
                id: '2.3', code: '2.3', name: 'PATRIMÔNIO SOCIAL', type: 'EQUITY', isAnalytic: false, level: 2, children: [
                    { id: '2.3.1', code: '2.3.1', name: 'Patrimônio Social', type: 'EQUITY', isAnalytic: false, level: 3 }
                ]
            }
        ]
    }
];

interface AccountNodeProps {
    account: FinancialAccount;
}

const AccountNode = ({ account }: AccountNodeProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = account.children && account.children.length > 0;

    return (
        <div className="ml-4">
            <div
                className="flex items-center gap-2 py-1.5 px-2 hover:bg-slate-800 rounded-md cursor-pointer group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-4 h-4 text-slate-500">
                    {hasChildren && (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                </div>
                <div className={`p-1 rounded ${hasChildren ? 'text-blue-400' : 'text-slate-400'}`}>
                    {hasChildren ? <Folder size={16} /> : <FileText size={16} />}
                </div>
                <div className="flex gap-3 text-sm">
                    <span className="font-mono text-slate-500">{account.code}</span>
                    <span className={`font-medium ${hasChildren ? 'text-slate-200' : 'text-slate-400'}`}>
                        {account.name}
                    </span>
                </div>
            </div>

            {isOpen && hasChildren && (
                <div className="border-l border-slate-800 ml-3">
                    {account.children?.map((child: FinancialAccount) => (
                        <AccountNode key={child.id} account={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function PlanOfAccountsPage() {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center border-b border-slate-800 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Plano de Contas</h2>
                    <p className="text-slate-400 text-sm mt-1">Estrutura Patrimonial e de Resultado (NBC T 10.19 / ITG 2002)</p>
                </div>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors">
                    Exportar PDF
                </button>
            </header>

            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 min-h-[500px]">
                {MOCK_ACCOUNTS.map(acc => (
                    <AccountNode key={acc.id} account={acc} />
                ))}
            </div>
        </div>
    );
}
