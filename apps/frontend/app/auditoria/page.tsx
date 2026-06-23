'use client';

import { useEffect, useMemo, useState } from 'react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { useActiveOperator } from '@/contexts/ActiveOperatorContext';
import { api } from '@/services/api';
import type { AuditAction, AuditLogDTO } from '@/types/dtos';
import { auditActionLabels, formatDate, userRoleLabels } from '@/lib/institutional';
import { AlertCircle, History, RefreshCw, ShieldCheck } from 'lucide-react';

const auditActions: Array<AuditAction | ''> = ['', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT'];

function formatMetadata(metadata: AuditLogDTO['metadata']) {
    if (!metadata || (Array.isArray(metadata) && metadata.length === 0)) return 'Sem metadados adicionais.';

    try {
        return JSON.stringify(metadata, null, 2);
    } catch {
        return 'Metadados indisponiveis.';
    }
}

export default function AuditPage() {
    const { associationId, activeAssociation, hasAssociation } = useActiveAssociation();
    const { operators, refreshOperators, hasOperator, hasPermission, loadingPermissions } = useActiveOperator();
    const [logs, setLogs] = useState<AuditLogDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<{
        action: AuditAction | '';
        entity: string;
        performedById: string;
        dateFrom: string;
        dateTo: string;
    }>({
        action: '',
        entity: '',
        performedById: '',
        dateFrom: '',
        dateTo: ''
    });

    const summary = useMemo(() => {
        return {
            total: logs.length,
            approvals: logs.filter((log) => log.action === 'APPROVE').length,
            rejections: logs.filter((log) => log.action === 'REJECT').length
        };
    }, [logs]);
    const canReadAudit = hasPermission('AUDIT_READ');

    async function loadAuditLogs() {
        if (!associationId) {
            setLogs([]);
            setLoading(false);
            return;
        }

        if (!hasOperator) {
            setLogs([]);
            setLoading(false);
            setError('Selecione um usuario operador para consultar auditoria.');
            return;
        }

        if (!loadingPermissions && !canReadAudit) {
            setLogs([]);
            setLoading(false);
            setError('Usuario operador sem permissao para consultar auditoria.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await refreshOperators();
            setLogs(await api.listAuditLogs({
                associationId,
                ...filters,
                limit: 100
            }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar auditoria.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAuditLogs();
    }, [associationId, hasOperator, canReadAudit, loadingPermissions]);

    return (
        <InstitutionalLayout title="Auditoria" activePath="/auditoria">
            <div className="app-page">
                <div className="app-page-header">
                    <div>
                        <h2 className="app-heading">Trilha de auditoria</h2>
                        <p className="app-subtitle">
                            {activeAssociation ? `${activeAssociation.name} - ` : ''}ultimos eventos operacionais registrados
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={loadAuditLogs}
                        className="app-button app-button-secondary"
                    >
                        <RefreshCw size={16} />
                        Atualizar
                    </button>
                </div>

                {error && (
                    <div className="app-alert app-alert-error text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="Selecione uma associacao ativa para consultar a trilha de auditoria." />}

                <section className="grid gap-4 md:grid-cols-3">
                    <div className="app-panel app-panel-pad">
                        <p className="text-xs font-semibold uppercase text-slate-500">Eventos</p>
                        <p className="mt-2 text-3xl font-bold text-slate-100">{summary.total}</p>
                    </div>
                    <div className="app-panel app-panel-pad">
                        <p className="text-xs font-semibold uppercase text-slate-500">Aprovacoes</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-300">{summary.approvals}</p>
                    </div>
                    <div className="app-panel app-panel-pad">
                        <p className="text-xs font-semibold uppercase text-slate-500">Rejeicoes</p>
                        <p className="mt-2 text-3xl font-bold text-rose-300">{summary.rejections}</p>
                    </div>
                </section>

                <section className="app-panel app-panel-pad">
                    <div className="grid gap-4 lg:grid-cols-[180px_1fr_260px_180px_180px_auto] lg:items-end">
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Acao</span>
                            <select
                                value={filters.action}
                                onChange={(event) => setFilters((current) => ({ ...current, action: event.target.value as AuditAction | '' }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                            >
                                {auditActions.map((action) => (
                                    <option key={action || 'ALL'} value={action}>
                                        {action ? auditActionLabels[action] : 'Todas'}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Entidade</span>
                            <input
                                value={filters.entity}
                                onChange={(event) => setFilters((current) => ({ ...current, entity: event.target.value }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                                placeholder="PaymentRequest, ProcurementProcess..."
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Operador</span>
                            <select
                                value={filters.performedById}
                                onChange={(event) => setFilters((current) => ({ ...current, performedById: event.target.value }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                            >
                                <option value="">Todos</option>
                                {operators.map((operator) => (
                                    <option key={operator.id} value={operator.id}>{operator.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">De</span>
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={(event) => setFilters((current) => ({ ...current, dateFrom: event.target.value }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">Ate</span>
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={(event) => setFilters((current) => ({ ...current, dateTo: event.target.value }))}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={loadAuditLogs}
                            disabled={!hasAssociation || loading || !hasOperator || (!loadingPermissions && !canReadAudit)}
                            className="app-button app-button-primary min-h-11"
                        >
                            <ShieldCheck size={16} />
                            Filtrar
                        </button>
                    </div>
                </section>

                <div className="app-table">
                    <div className="min-w-[980px]">
                        <div className="app-table-header grid grid-cols-[170px_1fr_1fr_170px_180px] gap-4 px-5 py-3">
                            <span>Data</span>
                            <span>Evento</span>
                            <span>Operador</span>
                            <span>Acao</span>
                            <span>Registro</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando auditoria...</div>
                        ) : logs.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                <History size={28} />
                                <span className="text-sm">Nenhum evento de auditoria encontrado.</span>
                            </div>
                        ) : (
                            <div>
                                {logs.map((log) => (
                                    <details key={log.id} className="app-table-row px-5 py-4 text-sm">
                                        <summary className="grid cursor-pointer grid-cols-[170px_1fr_1fr_170px_180px] items-center gap-4">
                                            <span className="text-slate-300">{formatDate(log.createdAt)}</span>
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-slate-100">{log.entity}</p>
                                                <p className="truncate text-xs text-slate-500">{log.id}</p>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-slate-200">{log.performedBy.name}</p>
                                                <p className="truncate text-xs text-slate-500">{userRoleLabels[log.performedBy.role]}</p>
                                            </div>
                                            <span className="app-badge app-badge-muted w-fit">{auditActionLabels[log.action]}</span>
                                            <span className="truncate font-mono text-xs text-slate-400">{log.entityId}</span>
                                        </summary>
                                        <pre className="mt-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-300">
                                            {formatMetadata(log.metadata)}
                                        </pre>
                                    </details>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
