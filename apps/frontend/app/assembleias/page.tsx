'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { AssemblyDTO } from '@/types/dtos';
import { assemblyStatusLabels, assemblyTypeLabels, formatDate } from '@/lib/institutional';
import { AlertCircle, Eye, Plus, RefreshCw, ScrollText } from 'lucide-react';

function statusClass(status: AssemblyDTO['status']) {
    if (status === 'CALLED') return 'bg-blue-500/10 text-blue-300';
    if (status === 'HELD') return 'bg-amber-500/10 text-amber-300';
    if (status === 'MINUTES_REGISTERED') return 'bg-emerald-500/10 text-emerald-300';
    return 'bg-slate-700 text-slate-300';
}

export default function AssembliesPage() {
    const [assemblies, setAssemblies] = useState<AssemblyDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const calledCount = useMemo(
        () => assemblies.filter((assembly) => assembly.status === 'CALLED').length,
        [assemblies]
    );

    async function loadAssemblies() {
        try {
            setLoading(true);
            setError(null);
            setAssemblies(await api.listAssemblies());
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar assembleias.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAssemblies();
    }, []);

    return (
        <InstitutionalLayout title="Assembleias" activePath="/assembleias">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Governanca e Assembleias</h2>
                        <p className="mt-1 text-sm text-slate-400">{assemblies.length} cadastradas, {calledCount} convocadas</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={loadAssemblies}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        <Link
                            href="/assembleias/nova"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Nova assembleia
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
                        <div className="grid grid-cols-[1.4fr_0.9fr_1fr_1fr_120px_120px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Assembleia</span>
                            <span>Tipo</span>
                            <span>Data</span>
                            <span>Convocacao</span>
                            <span>Status</span>
                            <span className="text-right">Acoes</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando assembleias...</div>
                        ) : assemblies.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                <ScrollText size={28} />
                                <span className="text-sm">Nenhuma assembleia cadastrada.</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {assemblies.map((assembly) => (
                                    <div key={assembly.id} className="grid grid-cols-[1.4fr_0.9fr_1fr_1fr_120px_120px] items-center gap-4 px-5 py-4 text-sm">
                                        <div className="min-w-0">
                                            <p className="font-medium text-slate-100">{assembly.title || assembly.agenda[0] || 'Assembleia'}</p>
                                            <p className="truncate text-xs text-slate-500">{assembly.location || assembly.address || 'Local a confirmar'}</p>
                                        </div>
                                        <span className="text-slate-300">{assemblyTypeLabels[assembly.type]}</span>
                                        <span className="text-slate-300">{formatDate(assembly.scheduledDate)}</span>
                                        <span className="text-slate-300">{assembly.callNoticeDays} dias</span>
                                        <span>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(assembly.status)}`}>
                                                {assemblyStatusLabels[assembly.status]}
                                            </span>
                                        </span>
                                        <Link
                                            href={`/assembleias/${assembly.id}`}
                                            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
                                        >
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
