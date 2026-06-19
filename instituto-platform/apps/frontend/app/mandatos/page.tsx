'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { PermissionRequired } from '@/components/layout/PermissionRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { useActiveOperator } from '@/contexts/ActiveOperatorContext';
import { api } from '@/services/api';
import { MandateDTO, MemberDTO } from '@/types/dtos';
import { formatDate, governanceRoleLabels } from '@/lib/institutional';
import { AlertCircle, CheckCircle, Plus, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';

export default function MandatesPage() {
    const { associationId, hasAssociation } = useActiveAssociation();
    const { hasOperator, hasPermission, loadingPermissions } = useActiveOperator();
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

        if (loadingPermissions) return;

        if (!hasOperator || !hasPermission('GOVERNANCE_READ') || !hasPermission('MEMBERS_READ')) {
            setMandates([]);
            setMembers([]);
            setLoading(false);
            setError('Usuario operador sem permissao para consultar mandatos.');
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
    }, [associationId, showOnlyActive, hasOperator, hasPermission, loadingPermissions]);

    async function closeMandate(id: string) {
        try {
            if (!hasOperator || !hasPermission('GOVERNANCE_MANAGE')) {
                throw new Error('Usuario operador sem permissao para encerrar mandato.');
            }

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

    const canReadMandates = hasPermission('GOVERNANCE_READ') && hasPermission('MEMBERS_READ');
    const canManageMandates = hasPermission('GOVERNANCE_MANAGE');

    return (
        <InstitutionalLayout title="Mandatos" activePath="/mandatos">
            <div className="app-page">
                <div className="app-page-header">
                    <div>
                        <h2 className="app-heading">Gestao de Mandatos</h2>
                        <p className="app-subtitle">{mandates.filter((mandate) => mandate.isActive).length} mandatos ativos</p>
                    </div>
                    <div className="app-toolbar">
                        <div className="app-segmented">
                            <button
                                type="button"
                                onClick={() => setShowOnlyActive(false)}
                                className={`app-segmented-button ${!showOnlyActive ? 'app-segmented-button-active' : ''}`}
                            >
                                Todos
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowOnlyActive(true)}
                                className={`app-segmented-button ${showOnlyActive ? 'app-segmented-button-active' : ''}`}
                            >
                                Ativos
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={loadData}
                            className="app-button app-button-secondary"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        {canManageMandates ? (
                            <Link
                                href="/mandatos/novo"
                                className="app-button app-button-primary"
                            >
                                <Plus size={16} />
                                Novo mandato
                            </Link>
                        ) : (
                            <span className="app-button app-button-secondary cursor-not-allowed opacity-70">
                                <Plus size={16} />
                                Novo mandato
                            </span>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="app-alert app-alert-error text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="app-alert app-alert-success text-sm">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired />}
                {hasAssociation && !loadingPermissions && (!hasOperator || !canReadMandates) && (
                    <PermissionRequired message="Selecione um operador com permissao de leitura de membros e governanca." />
                )}

                <div className="app-table">
                    <div className="min-w-[860px]">
                        <div className="app-table-header grid grid-cols-[1.1fr_1.4fr_1fr_1fr_100px_130px] gap-4 px-5 py-3">
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
                            <div>
                                {mandates.map((mandate) => {
                                    const member = memberById.get(mandate.memberId);
                                    return (
                                        <div key={mandate.id} className="app-table-row grid grid-cols-[1.1fr_1.4fr_1fr_1fr_100px_130px] items-center gap-4 px-5 py-4 text-sm">
                                            <span className="font-medium text-slate-100">{governanceRoleLabels[mandate.role]}</span>
                                            <span className="min-w-0 break-words text-slate-300">{member?.fullName || mandate.memberId}</span>
                                            <span className="text-slate-300">{formatDate(mandate.startDate)}</span>
                                            <span className="text-slate-300">{formatDate(mandate.endDate)}</span>
                                            <span>
                                                <span className={`app-badge ${mandate.isActive
                                                    ? 'app-badge-success'
                                                    : 'app-badge-muted'
                                                    }`}>
                                                    {mandate.isActive ? 'Ativo' : 'Encerrado'}
                                                </span>
                                            </span>
                                            <div className="flex justify-end">
                                                {mandate.isActive && (
                                                    <button
                                                        type="button"
                                                        onClick={() => closeMandate(mandate.id)}
                                                        disabled={closingId === mandate.id || !canManageMandates}
                                                        className="app-button app-button-danger min-h-9 px-3 py-2 text-xs disabled:opacity-60"
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
