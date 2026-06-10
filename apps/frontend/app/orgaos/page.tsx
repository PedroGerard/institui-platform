'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { GovernanceBodyDTO } from '@/types/dtos';
import { formatDate, governanceBodyCategoryLabels } from '@/lib/institutional';
import { AlertCircle, Eye, Network, Plus, RefreshCw } from 'lucide-react';

export default function GovernanceBodiesPage() {
    const [bodies, setBodies] = useState<GovernanceBodyDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const activeCount = useMemo(
        () => bodies.filter((body) => body.isActive).length,
        [bodies]
    );

    async function loadBodies() {
        try {
            setLoading(true);
            setError(null);
            setBodies(await api.listGovernanceBodies());
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar orgaos.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadBodies();
    }, []);

    return (
        <InstitutionalLayout title="Orgaos de governanca" activePath="/orgaos">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Orgaos e comites</h2>
                        <p className="mt-1 text-sm text-slate-400">{bodies.length} cadastrados, {activeCount} ativos</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={loadBodies}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        <Link
                            href="/orgaos/novo"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Novo orgao
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
                    <div className="min-w-[900px]">
                        <div className="grid grid-cols-[1.4fr_1.2fr_120px_120px_1fr_120px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Nome</span>
                            <span>Categoria</span>
                            <span>Integrantes</span>
                            <span>Status</span>
                            <span>Criado em</span>
                            <span className="text-right">Acoes</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando orgaos...</div>
                        ) : bodies.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                <Network size={28} />
                                <span className="text-sm">Nenhum orgao configurado.</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {bodies.map((body) => (
                                    <div key={body.id} className="grid grid-cols-[1.4fr_1.2fr_120px_120px_1fr_120px] items-center gap-4 px-5 py-4 text-sm">
                                        <div className="min-w-0">
                                            <p className="font-medium text-slate-100">{body.name}</p>
                                            <p className="truncate text-xs text-slate-500">{body.description || (body.isStatutory ? 'Previsto em estatuto' : 'Configuracao institucional')}</p>
                                        </div>
                                        <span className="text-slate-300">{governanceBodyCategoryLabels[body.category]}</span>
                                        <span className="text-slate-300">{body.members.filter((member) => member.isActive).length}</span>
                                        <span>
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${body.isActive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                                                {body.isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </span>
                                        <span className="text-slate-300">{formatDate(body.createdAt)}</span>
                                        <Link
                                            href={`/orgaos/${body.id}`}
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
