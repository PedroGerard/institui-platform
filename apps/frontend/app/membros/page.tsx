'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { MemberDTO } from '@/types/dtos';
import { formatDate, memberStatusLabels, memberTypeLabels } from '@/lib/institutional';
import { AlertCircle, Eye, Plus, RefreshCw, Users } from 'lucide-react';

function formatCpf(cpf: string) {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return cpf;
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default function MembersPage() {
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const activeCount = useMemo(
        () => members.filter((member) => member.status === 'ACTIVE').length,
        [members]
    );

    async function loadMembers() {
        try {
            setLoading(true);
            setError(null);
            setMembers(await api.listMembers());
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar membros.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMembers();
    }, []);

    return (
        <InstitutionalLayout title="Membros" activePath="/membros">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Gestao de Membros</h2>
                        <p className="text-sm text-slate-400 mt-1">{members.length} cadastrados, {activeCount} ativos</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={loadMembers}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        <Link
                            href="/membros/novo"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Novo membro
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
                    <div className="min-w-[760px]">
                    <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_120px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                        <span>Nome</span>
                        <span>CPF</span>
                        <span>Tipo</span>
                        <span>Status</span>
                        <span className="text-right">Acoes</span>
                    </div>

                    {loading ? (
                        <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando membros...</div>
                    ) : members.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                            <Users size={28} />
                            <span className="text-sm">Nenhum membro cadastrado.</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {members.map((member) => (
                                <div key={member.id} className="grid grid-cols-[1.6fr_1fr_1fr_1fr_120px] items-center gap-4 px-5 py-4 text-sm">
                                    <div>
                                        <p className="font-medium text-slate-100">{member.fullName}</p>
                                        <p className="text-xs text-slate-500">Admissao: {formatDate(member.admissionDate)}</p>
                                    </div>
                                    <span className="font-mono text-slate-300">{formatCpf(member.cpf)}</span>
                                    <span className="text-slate-300">{memberTypeLabels[member.memberType]}</span>
                                    <span>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${member.status === 'ACTIVE'
                                            ? 'bg-emerald-500/10 text-emerald-300'
                                            : 'bg-slate-700 text-slate-300'
                                            }`}>
                                            {memberStatusLabels[member.status]}
                                        </span>
                                    </span>
                                    <Link
                                        href={`/membros/${member.id}`}
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
