'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight, FileText, Folder, RefreshCw } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { FinancialAccount } from '@/types/financial';

type AccountNode = Omit<FinancialAccount, 'children' | 'level'> & {
    children: AccountNode[];
    level: number;
};

const accountTypeLabels: Record<FinancialAccount['type'], string> = {
    ASSET: 'Ativo',
    LIABILITY: 'Passivo',
    EQUITY: 'Patrimonio social',
    REVENUE: 'Receita',
    EXPENSE: 'Despesa'
};

function buildAccountTree(accounts: FinancialAccount[]): AccountNode[] {
    const nodes = new Map<string, AccountNode>();

    accounts.forEach((account) => {
        nodes.set(account.id, {
            ...account,
            children: [],
            level: 1
        });
    });

    const roots: AccountNode[] = [];

    nodes.forEach((node) => {
        if (node.parentId && nodes.has(node.parentId)) {
            nodes.get(node.parentId)?.children.push(node);
        } else {
            roots.push(node);
        }
    });

    function assignLevel(items: AccountNode[], level: number) {
        items
            .sort((left, right) => left.code.localeCompare(right.code, 'pt-BR', { numeric: true }))
            .forEach((item) => {
                item.level = level;
                assignLevel(item.children, level + 1);
            });
    }

    assignLevel(roots, 1);
    return roots;
}

function AccountTreeNode({ account }: { account: AccountNode }) {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = account.children.length > 0;

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="grid min-h-12 w-full grid-cols-[minmax(260px,1.8fr)_120px_110px_100px] items-center gap-4 border-b border-slate-800 px-4 py-2 text-left text-sm hover:bg-slate-800/60"
            >
                <span className="flex min-w-0 items-center gap-2" style={{ paddingLeft: `${Math.max(account.level - 1, 0) * 18}px` }}>
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-500">
                        {hasChildren ? (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : null}
                    </span>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${hasChildren ? 'bg-blue-500/10 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>
                        {hasChildren ? <Folder size={16} /> : <FileText size={16} />}
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate font-mono text-xs text-slate-500">{account.code}</span>
                        <span className={`block break-words font-medium ${hasChildren ? 'text-slate-100' : 'text-slate-300'}`}>{account.name}</span>
                    </span>
                </span>
                <span className="text-slate-300">{accountTypeLabels[account.type]}</span>
                <span className="text-slate-400">{account.isAnalytic ? 'Analitica' : 'Sintetica'}</span>
                <span className="text-slate-500">Nivel {account.level}</span>
            </button>

            {isOpen && hasChildren && account.children.map((child) => (
                <AccountTreeNode key={child.id} account={child} />
            ))}
        </div>
    );
}

export default function PlanOfAccountsPage() {
    const { associationId, hasAssociation } = useActiveAssociation();
    const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAccounts = useCallback(async () => {
        if (!associationId) {
            setAccounts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setAccounts(await api.listFinancialAccounts(associationId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar plano de contas.');
        } finally {
            setLoading(false);
        }
    }, [associationId]);

    useEffect(() => {
        loadAccounts();
    }, [loadAccounts]);

    const accountTree = useMemo(() => buildAccountTree(accounts), [accounts]);
    const analyticCount = accounts.filter((account) => account.isAnalytic).length;
    const syntheticCount = accounts.length - analyticCount;

    return (
        <InstitutionalLayout title="Plano de Contas" activePath="/tesouraria/plano-contas">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Plano de Contas</h2>
                        <p className="mt-1 text-sm text-slate-400">Estrutura contabil vinculada a associacao ativa.</p>
                    </div>
                    <button
                        type="button"
                        onClick={loadAccounts}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                    >
                        <RefreshCw size={16} />
                        Atualizar
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired />}

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Contas cadastradas</div>
                        <div className="mt-2 text-xl font-bold text-slate-100">{accounts.length}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Analiticas</div>
                        <div className="mt-2 text-xl font-bold text-blue-300">{analyticCount}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Sinteticas</div>
                        <div className="mt-2 text-xl font-bold text-slate-100">{syntheticCount}</div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <div className="min-w-[760px]">
                        <div className="grid grid-cols-[minmax(260px,1.8fr)_120px_110px_100px] gap-4 border-b border-slate-800 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Conta</span>
                            <span>Tipo</span>
                            <span>Natureza</span>
                            <span>Nivel</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando plano de contas...</div>
                        ) : accountTree.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                <Folder size={28} />
                                <span className="text-sm">Nenhuma conta cadastrada para a associacao ativa.</span>
                            </div>
                        ) : (
                            accountTree.map((account) => <AccountTreeNode key={account.id} account={account} />)
                        )}
                    </div>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
