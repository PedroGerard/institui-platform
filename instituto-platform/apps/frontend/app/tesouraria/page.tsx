'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Clock, FileText, Plus, RefreshCw, ShieldAlert, TrendingUp, Wallet } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { PermissionRequired } from '@/components/layout/PermissionRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { useActiveOperator } from '@/contexts/ActiveOperatorContext';
import { api } from '@/services/api';
import { PaymentRequestDTO, PaymentRequestSummaryDTO } from '@/types/dtos';
import { formatCurrency, formatDate, paymentRequestStatusLabels } from '@/lib/institutional';

export default function TreasuryDashboard() {
    const { associationId, hasAssociation } = useActiveAssociation();
    const { hasOperator, hasPermission, loadingPermissions } = useActiveOperator();
    const [summary, setSummary] = useState<PaymentRequestSummaryDTO | null>(null);
    const [payments, setPayments] = useState<PaymentRequestDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        if (!associationId) {
            setSummary(null);
            setPayments([]);
            setLoading(false);
            return;
        }

        if (loadingPermissions) return;

        if (!hasOperator || !hasPermission('TREASURY_READ')) {
            setSummary(null);
            setPayments([]);
            setLoading(false);
            setError('Usuario operador sem permissao para consultar tesouraria.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const [summaryData, paymentData] = await Promise.all([
                api.getPaymentRequestSummary({ associationId }),
                api.listPaymentRequests({ associationId })
            ]);
            setSummary(summaryData);
            setPayments(paymentData.slice(0, 5));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar tesouraria.');
        } finally {
            setLoading(false);
        }
    }, [associationId, hasOperator, hasPermission, loadingPermissions]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const cards = [
        {
            label: 'Total solicitado',
            value: formatCurrency(summary?.totalAmount),
            icon: Wallet,
            tone: 'text-blue-300',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Bloqueado',
            value: formatCurrency(summary?.byStatus.BLOCKED.amount),
            icon: ShieldAlert,
            tone: 'text-rose-300',
            bg: 'bg-rose-500/10'
        },
        {
            label: 'Aprovado',
            value: formatCurrency(summary?.byStatus.APPROVED.amount),
            icon: TrendingUp,
            tone: 'text-emerald-300',
            bg: 'bg-emerald-500/10'
        },
        {
            label: 'Vencidos',
            value: String(summary?.overdueCount || 0),
            icon: Clock,
            tone: 'text-amber-300',
            bg: 'bg-amber-500/10'
        }
    ];
    const canManageTreasury = hasPermission('TREASURY_MANAGE');
    const canReadTreasury = hasPermission('TREASURY_READ');

    return (
        <InstitutionalLayout title="Tesouraria" activePath="/tesouraria">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Fluxo financeiro operacional</h2>
                        <p className="mt-1 text-sm text-slate-400">Resumo de pagamentos, bloqueios e pendencias financeiras.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={loadData}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        {canManageTreasury ? (
                            <Link
                                href="/tesouraria/pagamentos/novo"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Plus size={16} />
                                Solicitar pagamento
                            </Link>
                        ) : (
                            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 opacity-70">
                                <Plus size={16} />
                                Solicitar pagamento
                            </span>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired />}
                {hasAssociation && !loadingPermissions && (!hasOperator || !canReadTreasury) && (
                    <PermissionRequired message="Selecione um operador com permissao de leitura da tesouraria." />
                )}

                <div className="grid gap-4 md:grid-cols-4">
                    {cards.map((card) => (
                        <div key={card.label} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <div className={`${card.bg} ${card.tone} flex h-11 w-11 items-center justify-center rounded-lg`}>
                                    <card.icon size={22} />
                                </div>
                                {loading && <span className="text-xs font-medium text-slate-500">Carregando</span>}
                            </div>
                            <div className="text-xs font-semibold uppercase text-slate-500">{card.label}</div>
                            <div className={`mt-2 text-xl font-bold ${card.tone}`}>{card.value}</div>
                        </div>
                    ))}
                </div>

                {summary && summary.blockingReasons.length > 0 && (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <h3 className="mb-3 text-sm font-semibold text-slate-100">Bloqueios que precisam de atencao</h3>
                        <div className="flex flex-wrap gap-2">
                            {summary.blockingReasons.slice(0, 6).map((item) => (
                                <span key={item.reason} className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
                                    {item.reason}: {item.count}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="rounded-lg border border-slate-800 bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-800 p-5">
                        <h3 className="font-semibold text-slate-100">Solicitacoes recentes</h3>
                        <Link href="/tesouraria/pagamentos" className="inline-flex items-center gap-1 text-sm text-blue-300 hover:text-blue-200">
                            Ver pagamentos <ArrowRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando movimentacoes...</div>
                    ) : payments.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                            <FileText size={28} />
                            <span className="text-sm">Nenhuma solicitacao de pagamento cadastrada.</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {payments.map((payment) => (
                                <Link
                                    key={payment.id}
                                    href={`/tesouraria/pagamentos/${payment.id}`}
                                    className="grid gap-3 p-4 text-sm hover:bg-slate-800/50 md:grid-cols-[1.4fr_1fr_120px_150px]"
                                >
                                    <span className="min-w-0">
                                        <span className="block break-words font-medium text-slate-100">{payment.description}</span>
                                        <span className="mt-1 block text-xs text-slate-500">{payment.payeeName}</span>
                                    </span>
                                    <span className="font-semibold text-slate-100">{formatCurrency(payment.amount)}</span>
                                    <span className="text-slate-400">{formatDate(payment.dueDate)}</span>
                                    <span className="text-slate-300">{paymentRequestStatusLabels[payment.status]}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </InstitutionalLayout>
    );
}
