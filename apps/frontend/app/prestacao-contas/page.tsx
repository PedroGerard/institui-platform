'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { AccountabilityProjectDTO, AccountabilityStatus, InstrumentType } from '@/types/dtos';
import { accountabilityStatusLabels, formatDate, instrumentTypeLabels } from '@/lib/institutional';
import { AlertCircle, Eye, FilePlus, RefreshCw } from 'lucide-react';

const statuses = Object.keys(accountabilityStatusLabels) as AccountabilityStatus[];
const instruments = Object.keys(instrumentTypeLabels) as InstrumentType[];

export default function AccountabilityProjectsPage() {
    const [projects, setProjects] = useState<AccountabilityProjectDTO[]>([]);
    const [status, setStatus] = useState<AccountabilityStatus | 'ALL'>('ALL');
    const [instrumentType, setInstrumentType] = useState<InstrumentType | 'ALL'>('ALL');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const submittedCount = useMemo(
        () => projects.filter((project) => project.status === 'SUBMITTED').length,
        [projects]
    );

    async function loadProjects() {
        try {
            setLoading(true);
            setError(null);
            setProjects(await api.listAccountabilityProjects({
                status: status === 'ALL' ? undefined : status,
                instrumentType: instrumentType === 'ALL' ? undefined : instrumentType,
                year: year || undefined
            }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar prestacoes.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProjects();
    }, [status, instrumentType, year]);

    return (
        <InstitutionalLayout title="Prestacao de contas" activePath="/prestacao-contas">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Projetos de prestacao</h2>
                        <p className="mt-1 text-sm text-slate-400">{projects.length} projeto(s), {submittedCount} submetido(s)</p>
                    </div>
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <select value={status} onChange={(event) => setStatus(event.target.value as AccountabilityStatus | 'ALL')} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500">
                            <option value="ALL">Todos os status</option>
                            {statuses.map((item) => <option key={item} value={item}>{accountabilityStatusLabels[item]}</option>)}
                        </select>
                        <select value={instrumentType} onChange={(event) => setInstrumentType(event.target.value as InstrumentType | 'ALL')} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500">
                            <option value="ALL">Todos os instrumentos</option>
                            {instruments.map((item) => <option key={item} value={item}>{instrumentTypeLabels[item]}</option>)}
                        </select>
                        <input value={year} onChange={(event) => setYear(event.target.value)} placeholder="Ano" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500 lg:w-24" />
                        <button onClick={loadProjects} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        <Link href="/prestacao-contas/nova" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            <FilePlus size={16} />
                            Nova
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <div className="min-w-[920px]">
                        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_130px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Projeto</span>
                            <span>Instrumento</span>
                            <span>Periodo</span>
                            <span>Status</span>
                            <span className="text-right">Acoes</span>
                        </div>
                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando prestacoes...</div>
                        ) : projects.length === 0 ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Nenhuma prestacao cadastrada.</div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {projects.map((project) => (
                                    <div key={project.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_130px] items-center gap-4 px-5 py-4 text-sm">
                                        <div>
                                            <p className="font-medium text-slate-100">{project.name}</p>
                                            <p className="text-xs text-slate-500">{project.grantor}</p>
                                        </div>
                                        <span className="text-slate-300">{instrumentTypeLabels[project.instrumentType]}</span>
                                        <span className="text-slate-300">{formatDate(project.periodStart)} a {formatDate(project.periodEnd)}</span>
                                        <span>
                                            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">{accountabilityStatusLabels[project.status]}</span>
                                        </span>
                                        <Link href={`/prestacao-contas/${project.id}`} className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800">
                                            <Eye size={14} />
                                            Ver
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
