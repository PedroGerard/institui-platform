'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
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
    const { associationId, hasAssociation } = useActiveAssociation();
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const activeCount = useMemo(
        () => members.filter((member) => member.status === 'ACTIVE').length,
        [members]
    );

    async function loadMembers() {
        if (!associationId) {
            setMembers([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setMembers(await api.listMembers(associationId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar membros.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMembers();
    }, [associationId]);

    return (
        <InstitutionalLayout title="Membros" activePath="/membros">
            <div className="app-page">
                <div className="app-page-header">
                    <div>
                        <h2 className="app-heading">Gestao de Membros</h2>
                        <p className="app-subtitle">{members.length} cadastrados, {activeCount} ativos</p>
                    </div>
                    <div className="app-toolbar">
                        <button
                            type="button"
                            onClick={loadMembers}
                            className="app-button app-button-secondary"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        <Link
                            href="/membros/novo"
                            className="app-button app-button-primary"
                        >
                            <Plus size={16} />
                            Novo membro
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="app-alert app-alert-error text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired />}

                <div className="app-table">
                    <div className="min-w-[760px]">
                    <div className="app-table-header grid grid-cols-[1.6fr_1fr_1fr_1fr_120px] gap-4 px-5 py-3">
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
                        <div>
                            {members.map((member) => (
                                <div key={member.id} className="app-table-row grid grid-cols-[1.6fr_1fr_1fr_1fr_120px] items-center gap-4 px-5 py-4 text-sm">
                                    <div>
                                        <p className="font-medium text-slate-100">{member.fullName}</p>
                                        <p className="text-xs text-slate-500">Admissao: {formatDate(member.admissionDate)}</p>
                                    </div>
                                    <span className="font-mono text-slate-300">{formatCpf(member.cpf)}</span>
                                    <span className="text-slate-300">{memberTypeLabels[member.memberType]}</span>
                                    <span>
                                        <span className={`app-badge ${member.status === 'ACTIVE'
                                            ? 'app-badge-success'
                                            : 'app-badge-muted'
                                            }`}>
                                            {memberStatusLabels[member.status]}
                                        </span>
                                    </span>
                                    <Link
                                        href={`/membros/${member.id}`}
                                        className="app-button app-button-secondary ml-auto min-h-9 px-3 py-2 text-xs"
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
