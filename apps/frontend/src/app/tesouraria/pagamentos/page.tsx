'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Clock, Plus, RefreshCw, Wallet } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { PaymentRequestDTO, PaymentRequestStatus, PaymentRequestSummaryDTO } from '@/types/dtos';
import { DEFAULT_ASSOCIATION_ID, formatCurrency, formatDate, paymentRequestStatusLabels } from '@/lib/institutional';

export default function PaymentRequestsPage() {
    const [payments, setPayments] = useState<PaymentRequestDTO[]>([]);
    const [summary, setSummary] = useState<PaymentRequestSummaryDTO | null>(null);
    const [status, setStatus] = useState<PaymentRequestStatus | ''>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const [paymentData, summaryData] = await Promise.all([
                api.listPaymentRequests({
                    associationId: DEFAULT_ASSOCIATION_ID,
                    status: status || undefined
                }),
                api.getPaymentRequestSummary({ associationId: DEFAULT_ASSOCIATION_ID })
            ]);
            setPayments(paymentData);
            setSummary(summaryData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar pagamentos.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [status]);

    return (
        <InstitutionalLayout title="Pagamentos" activePath="/tesouraria/pagamentos">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Solicitacoes de Pagamento</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            {(summary?.byStatus.PENDING_APPROVAL.count || 0)} aguardando aprovacao, {(summary?.byStatus.BLOCKED.count || 0)} bloqueadas, {(summary?.byStatus.APPROVED.count || 0)} prontas para baixa
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value as PaymentRequestStatus | '')}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                        >
                            <option value="">Todos os status</option>
                            {Object.entries(paymentRequestStatusLabels).map(([value, label]) => (
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
                            href="/tesouraria/pagamentos/novo"
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                        >
                            <Plus size={16} />
                            Solicitar pagamento
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Total solicitado</div>
                        <div className="mt-2 text-xl font-bold text-slate-100">{formatCurrency(summary?.totalAmount)}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Bloqueado</div>
                        <div className="mt-2 text-xl font-bold text-rose-300">{formatCurrency(summary?.byStatus.BLOCKED.amount)}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Aprovado</div>
                        <div className="mt-2 text-xl font-bold text-blue-300">{formatCurrency(summary?.byStatus.APPROVED.amount)}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Vencidos</div>
                        <div className="mt-2 text-xl font-bold text-amber-300">{summary?.overdueCount || 0}</div>
                    </div>
                </div>

                {summary && summary.blockingReasons.length > 0 && (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <h3 className="mb-3 text-sm font-semibold text-slate-100">Principais bloqueios</h3>
                        <div className="flex flex-wrap gap-2">
                            {summary.blockingReasons.slice(0, 5).map((item) => (
                                <span key={item.reason} className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
                                    {item.reason}: {item.count}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <div className="min-w-[980px]">
                        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_120px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Descricao</span>
                            <span>Favorecido</span>
                            <span>Valor</span>
                            <span>Vencimento</span>
                            <span>Status</span>
                            <span className="text-right">Acoes</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando pagamentos...</div>
                        ) : payments.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                <Wallet size={28} />
                                <span className="text-sm">Nenhuma solicitacao cadastrada.</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_120px] items-center gap-4 px-5 py-4 text-sm">
                                        <div className="min-w-0">
                                            <div className="break-words font-medium text-slate-100">{payment.description}</div>
                                            <div className="mt-1 text-xs text-slate-500">{payment.document?.title || 'Documento nao vinculado'}</div>
                                        </div>
                                        <span className="min-w-0 break-words text-slate-300">{payment.payeeName}</span>
                                        <span className="font-semibold text-slate-100">{formatCurrency(payment.amount)}</span>
                                        <span className="text-slate-300">{formatDate(payment.dueDate)}</span>
                                        <span>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${payment.status === 'PAID'
                                                ? 'bg-emerald-500/10 text-emerald-300'
                                                : payment.status === 'APPROVED'
                                                    ? 'bg-blue-500/10 text-blue-300'
                                                    : payment.status === 'BLOCKED' || payment.status === 'REJECTED'
                                                        ? 'bg-rose-500/10 text-rose-300'
                                                        : 'bg-amber-500/10 text-amber-300'
                                                }`}>
                                                {payment.status === 'PAID' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                                {paymentRequestStatusLabels[payment.status]}
                                            </span>
                                        </span>
                                        <div className="flex justify-end">
                                            <Link href={`/tesouraria/pagamentos/${payment.id}`} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800">
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
