'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { MandateDTO, MemberDTO } from '@/types/dtos';
import { formatDate, governanceRoleLabels } from '@/lib/institutional';
import { AlertCircle, CheckCircle, Plus, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';

export default function MandatesPage() {
    const { associationId, hasAssociation } = useActiveAssociation();
    const [mandates, setMandates] = useState<MandateDTO[]>([]);
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [showOnlyActive, setShowOnlyActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [closingId, setClosingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const memberById = useMemo(
        () => new Map(members.map((member) => [member.id, member])),
        [members]
    );

    async function loadData() {
        if (!associationId) {
            setMandates([]);
            setMembers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const [mandateData, memberData] = await Promise.all([
                showOnlyActive ? api.listActiveMandates(associationId) : api.listMandates(associationId),
                api.listMembers(associationId)
            ]);
            setMandates(mandateData);
            setMembers(memberData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar mandatos.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [associationId, showOnlyActive]);

    async function closeMandate(id: string) {
        try {
            setClosingId(id);
            setError(null);
            setSuccess(null);
            await api.closeMandate(id, new Date().toISOString().slice(0, 10));
            setSuccess('Mandato encerrado.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao encerrar mandato.');
        } finally {
            setClosingId(null);
        }
    }

    return (
        <InstitutionalLayout title="Mandatos" activePath="/mandatos">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Gestao de Mandatos</h2>
                        <p className="mt-1 text-sm text-slate-400">{mandates.filter((mandate) => mandate.isActive).length} mandatos ativos</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
                            <button
                                type="button"
                                onClick={() => setShowOnlyActive(false)}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium ${!showOnlyActive ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                            >
                                Todos
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowOnlyActive(true)}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium ${showOnlyActive ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                            >
                                Ativos
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={loadData}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        <Link
                            href="/mandatos/novo"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Novo mandato
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired />}

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <div className="min-w-[860px]">
                        <div className="grid grid-cols-[1.1fr_1.4fr_1fr_1fr_100px_130px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Cargo</span>
                            <span>Membro</span>
                            <span>Inicio</span>
                            <span>Fim</span>
                            <span>Status</span>
                            <span className="text-right">Acoes</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando mandatos...</div>
                        ) : mandates.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                <ShieldCheck size={28} />
                                <span className="text-sm">Nenhum mandato cadastrado.</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {mandates.map((mandate) => {
                                    const member = memberById.get(mandate.memberId);
                                    return (
                                        <div key={mandate.id} className="grid grid-cols-[1.1fr_1.4fr_1fr_1fr_100px_130px] items-center gap-4 px-5 py-4 text-sm">
                                            <span className="font-medium text-slate-100">{governanceRoleLabels[mandate.role]}</span>
                                            <span className="min-w-0 break-words text-slate-300">{member?.fullName || mandate.memberId}</span>
                                            <span className="text-slate-300">{formatDate(mandate.startDate)}</span>
                                            <span className="text-slate-300">{formatDate(mandate.endDate)}</span>
                                            <span>
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${mandate.isActive
                                                    ? 'bg-emerald-500/10 text-emerald-300'
                                                    : 'bg-slate-700 text-slate-300'
                                                    }`}>
                                                    {mandate.isActive ? 'Ativo' : 'Encerrado'}
                                                </span>
                                            </span>
                                            <div className="flex justify-end">
                                                {mandate.isActive && (
                                                    <button
                                                        type="button"
                                                        onClick={() => closeMandate(mandate.id)}
                                                        disabled={closingId === mandate.id}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60"
                                                    >
                                                        <XCircle size={14} />
                                                        Encerrar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
