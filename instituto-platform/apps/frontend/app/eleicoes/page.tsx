'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { ElectionDTO, ElectionStatus } from '@/types/dtos';
import { electionStatusLabels, formatDate } from '@/lib/institutional';
import { AlertCircle, CheckCircle, Plus, RefreshCw, Vote } from 'lucide-react';

export default function ElectionsPage() {
    const { associationId, hasAssociation } = useActiveAssociation();
    const [elections, setElections] = useState<ElectionDTO[]>([]);
    const [status, setStatus] = useState<ElectionStatus | ''>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const totals = useMemo(() => ({
        all: elections.length,
        approved: elections.filter((election) => election.status === 'APPROVED' || election.status === 'MANDATES_CREATED').length
    }), [elections]);

    async function loadData() {
        if (!associationId) {
            setElections([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setElections(await api.listElections({ associationId, ...(status ? { status } : {}) }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar eleicoes.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [associationId, status]);

    return (
        <InstitutionalLayout title="Eleicoes" activePath="/eleicoes">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Eleicoes e Chapas</h2>
                        <p className="mt-1 text-sm text-slate-400">{totals.all} processos cadastrados, {totals.approved} homologados ou empossados</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value as ElectionStatus | '')}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                        >
                            <option value="">Todos os status</option>
                            {Object.entries(electionStatusLabels).map(([value, label]) => (
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
                            href="/eleicoes/nova"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Nova eleicao
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired />}

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <div className="min-w-[920px]">
                        <div className="grid grid-cols-[1.5fr_1.1fr_1fr_1fr_130px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Processo</span>
                            <span>Origem</span>
                            <span>Inicio mandato</span>
                            <span>Status</span>
                            <span className="text-right">Acoes</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando eleicoes...</div>
                        ) : elections.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                <Vote size={28} />
                                <span className="text-sm">Nenhuma eleicao cadastrada.</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {elections.map((election) => (
                                    <div key={election.id} className="grid grid-cols-[1.5fr_1.1fr_1fr_1fr_130px] items-center gap-4 px-5 py-4 text-sm">
                                        <div className="min-w-0">
                                            <div className="font-medium text-slate-100">{election.title}</div>
                                            <div className="mt-1 text-xs text-slate-500">{election.governanceBody?.name || 'Orgao nao vinculado'}</div>
                                        </div>
                                        <span className="text-slate-300">{election.assembly?.title || election.assembly?.type || '-'}</span>
                                        <span className="text-slate-300">{formatDate(election.termStartDate)}</span>
                                        <span>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${election.status === 'MANDATES_CREATED'
                                                ? 'bg-emerald-500/10 text-emerald-300'
                                                : election.status === 'APPROVED'
                                                    ? 'bg-blue-500/10 text-blue-300'
                                                    : 'bg-slate-700 text-slate-300'
                                                }`}>
                                                {(election.status === 'APPROVED' || election.status === 'MANDATES_CREATED') && <CheckCircle size={12} />}
                                                {electionStatusLabels[election.status]}
                                            </span>
                                        </span>
                                        <div className="flex justify-end">
                                            <Link href={`/eleicoes/${election.id}`} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800">
                                                Abrir
                                            </Link>
                                        </div>
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
