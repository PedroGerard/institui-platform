'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, FileText, Plus, RefreshCw, ShoppingCart } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { ProcurementProcessDTO, ProcurementProcessStatus } from '@/types/dtos';
import { DEFAULT_ASSOCIATION_ID, formatCurrency, formatDate, procurementProcessStatusLabels } from '@/lib/institutional';

export default function ProcurementProcessesPage() {
    const [processes, setProcesses] = useState<ProcurementProcessDTO[]>([]);
    const [status, setStatus] = useState<ProcurementProcessStatus | ''>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const totals = useMemo(() => {
        return processes.reduce((acc, process) => {
            acc.items += process.items.length;
            acc.contracts += process.contracts.length;
            acc.amount += process.contracts.reduce((sum, contract) => sum + Number(contract.amount || 0), 0);
            return acc;
        }, { items: 0, contracts: 0, amount: 0 });
    }, [processes]);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            setProcesses(await api.listProcurementProcesses({
                associationId: DEFAULT_ASSOCIATION_ID,
                status: status || undefined
            }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar compras.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [status]);

    function statusClass(value: ProcurementProcessStatus) {
        if (value === 'CONTRACTED') return 'bg-emerald-500/10 text-emerald-300';
        if (value === 'HOMOLOGATED' || value === 'SUPPLIERS_SELECTED') return 'bg-blue-500/10 text-blue-300';
        if (value === 'CANCELED') return 'bg-rose-500/10 text-rose-300';
        return 'bg-amber-500/10 text-amber-300';
    }

    return (
        <InstitutionalLayout title="Compras MROSC" activePath="/compras">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Compras e Contratacoes MROSC</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Edital, mapa de precos, ata de selecao, homologacao e contrato no mesmo processo.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value as ProcurementProcessStatus | '')}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                        >
                            <option value="">Todos os status</option>
                            {Object.entries(procurementProcessStatusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={loadData}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        <Link
                            href="/compras/novo"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                            <Plus size={16} />
                            Novo processo
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Processos</div>
                        <div className="mt-2 text-xl font-bold text-slate-100">{processes.length}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Itens cotados</div>
                        <div className="mt-2 text-xl font-bold text-blue-300">{totals.items}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Contratos</div>
                        <div className="mt-2 text-xl font-bold text-emerald-300">{totals.contracts}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Valor contratado</div>
                        <div className="mt-2 text-xl font-bold text-slate-100">{formatCurrency(totals.amount)}</div>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <table className="w-full min-w-[960px] text-left text-sm">
                        <thead className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Processo</th>
                                <th className="px-4 py-3">Edital</th>
                                <th className="px-4 py-3">Periodo</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Documentos</th>
                                <th className="px-4 py-3 text-right">Acesso</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Carregando processos...</td>
                                </tr>
                            ) : processes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Nenhum processo de compra encontrado.</td>
                                </tr>
                            ) : processes.map((process) => (
                                <tr key={process.id} className="hover:bg-slate-800/40">
                                    <td className="px-4 py-4">
                                        <div className="font-medium text-slate-100">{process.title}</div>
                                        <div className="mt-1 max-w-lg truncate text-xs text-slate-500">{process.object}</div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-300">{process.noticeNumber}</td>
                                    <td className="px-4 py-4 text-slate-300">
                                        {formatDate(process.proposalStartDate)} a {formatDate(process.proposalEndDate)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(process.status)}`}>
                                            {procurementProcessStatusLabels[process.status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-300">
                                        <div className="inline-flex items-center gap-2">
                                            <FileText size={14} />
                                            {process.documents.length}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Link href={`/compras/${process.id}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800">
                                            <ShoppingCart size={14} />
                                            Abrir
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
