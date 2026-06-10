'use client';

import { FormEvent, use, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, CheckCircle, FileText, Save, ShieldCheck, Wallet, XCircle } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { PaymentApprovalRole, PaymentRequestDTO } from '@/types/dtos';
import { formatCurrency, formatDate, paymentApprovalRoleLabels, paymentRequestStatusLabels } from '@/lib/institutional';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function PaymentRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [payment, setPayment] = useState<PaymentRequestDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [approvalForm, setApprovalForm] = useState({
        approvedById: '',
        role: 'DIRECTOR_PRESIDENT' as PaymentApprovalRole,
        notes: ''
    });
    const [paidAt, setPaidAt] = useState(new Date().toISOString().split('T')[0]);
    const [complianceForm, setComplianceForm] = useState({
        documentId: '',
        accountabilityProjectId: '',
        fundId: '',
        requiresContract: false,
        contractFileUrl: '',
        requiresNegativeCertificate: false,
        negativeCertificateExpiresAt: ''
    });

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const paymentData = await api.getPaymentRequest(id);
            setPayment(paymentData);
            setComplianceForm({
                documentId: paymentData.documentId || '',
                accountabilityProjectId: paymentData.accountabilityProjectId || '',
                fundId: paymentData.fundId || '',
                requiresContract: paymentData.requiresContract,
                contractFileUrl: paymentData.contractFileUrl || '',
                requiresNegativeCertificate: paymentData.requiresNegativeCertificate,
                negativeCertificateExpiresAt: paymentData.negativeCertificateExpiresAt ? paymentData.negativeCertificateExpiresAt.slice(0, 10) : ''
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar pagamento.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [id]);

    async function approve(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving('approve');
        setError(null);
        setSuccess(null);

        try {
            await api.approvePaymentRequest(id, {
                approvedById: approvalForm.approvedById || undefined,
                role: approvalForm.role,
                notes: approvalForm.notes || undefined
            });
            setApprovalForm({ approvedById: '', role: 'DIRECTOR_PRESIDENT', notes: '' });
            setSuccess('Aprovacao registrada.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao aprovar pagamento.');
        } finally {
            setSaving(null);
        }
    }

    async function regularize(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving('regularize');
        setError(null);
        setSuccess(null);

        try {
            await api.regularizePaymentRequest(id, {
                documentId: complianceForm.documentId || undefined,
                accountabilityProjectId: complianceForm.accountabilityProjectId || undefined,
                fundId: complianceForm.fundId || undefined,
                requiresContract: complianceForm.requiresContract,
                contractFileUrl: complianceForm.contractFileUrl || undefined,
                requiresNegativeCertificate: complianceForm.requiresNegativeCertificate,
                negativeCertificateExpiresAt: complianceForm.negativeCertificateExpiresAt || undefined
            });
            setSuccess('Regularizacao documental salva e bloqueios recalculados.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao regularizar pagamento.');
        } finally {
            setSaving(null);
        }
    }

    async function reject() {
        setSaving('reject');
        setError(null);
        setSuccess(null);

        try {
            await api.rejectPaymentRequest(id, {
                approvedById: approvalForm.approvedById || undefined,
                role: approvalForm.role,
                notes: approvalForm.notes || undefined
            });
            setSuccess('Rejeicao registrada.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao rejeitar pagamento.');
        } finally {
            setSaving(null);
        }
    }

    async function pay() {
        setSaving('pay');
        setError(null);
        setSuccess(null);

        try {
            await api.payPaymentRequest(id, {
                paidAt
            });
            setSuccess('Pagamento baixado e lancamento financeiro criado.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao baixar pagamento.');
        } finally {
            setSaving(null);
        }
    }

    return (
        <InstitutionalLayout title="Pagamento" activePath="/tesouraria/pagamentos">
            <div className="space-y-6">
                <Link href="/tesouraria/pagamentos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

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

                {loading ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Carregando pagamento...</div>
                ) : payment ? (
                    <>
                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-100">{payment.description}</h2>
                                    <p className="mt-1 text-sm text-slate-400">{payment.payeeName} · {formatCurrency(payment.amount)}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.status === 'PAID'
                                    ? 'bg-emerald-500/10 text-emerald-300'
                                    : payment.status === 'APPROVED'
                                        ? 'bg-blue-500/10 text-blue-300'
                                        : payment.status === 'BLOCKED' || payment.status === 'REJECTED'
                                            ? 'bg-rose-500/10 text-rose-300'
                                            : 'bg-amber-500/10 text-amber-300'
                                    }`}>
                                    {paymentRequestStatusLabels[payment.status]}
                                </span>
                            </div>
                            <div className="mt-5 grid gap-4 text-sm md:grid-cols-4">
                                <div><span className="block text-xs uppercase text-slate-500">Vencimento</span>{formatDate(payment.dueDate)}</div>
                                <div><span className="block text-xs uppercase text-slate-500">Documento</span>{payment.document?.title || '-'}</div>
                                <div><span className="block text-xs uppercase text-slate-500">Despesa</span>{payment.debitAccount?.code} - {payment.debitAccount?.name}</div>
                                <div><span className="block text-xs uppercase text-slate-500">Saida</span>{payment.creditAccount?.code} - {payment.creditAccount?.name}</div>
                            </div>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <AlertCircle size={18} />
                                    <h3 className="font-semibold">Bloqueios</h3>
                                </div>
                                {[...payment.hardBlockingReasons, ...payment.approvalBlockingReasons].length === 0 ? (
                                    <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                                        <CheckCircle size={18} />
                                        Pagamento liberado para baixa.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {[...payment.hardBlockingReasons, ...payment.approvalBlockingReasons].map((reason) => (
                                            <div key={reason} className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
                                                {reason}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <form onSubmit={regularize} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <FileText size={18} />
                                    <h3 className="font-semibold">Regularizacao documental</h3>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Documento habil</label>
                                        <input value={complianceForm.documentId} onChange={(event) => setComplianceForm({ ...complianceForm, documentId: event.target.value })} className={inputClass} placeholder="ID do documento" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Projeto de prestacao</label>
                                        <input value={complianceForm.accountabilityProjectId} onChange={(event) => setComplianceForm({ ...complianceForm, accountabilityProjectId: event.target.value })} className={inputClass} placeholder="Opcional" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Fundo</label>
                                        <input value={complianceForm.fundId} onChange={(event) => setComplianceForm({ ...complianceForm, fundId: event.target.value })} className={inputClass} placeholder="Opcional" />
                                    </div>
                                    <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                                        <input type="checkbox" checked={complianceForm.requiresContract} onChange={(event) => setComplianceForm({ ...complianceForm, requiresContract: event.target.checked })} />
                                        Exigir contrato
                                    </label>
                                    <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                                        <input type="checkbox" checked={complianceForm.requiresNegativeCertificate} onChange={(event) => setComplianceForm({ ...complianceForm, requiresNegativeCertificate: event.target.checked })} />
                                        Exigir certidao
                                    </label>
                                    <div>
                                        <label className={labelClass}>URL do contrato</label>
                                        <input value={complianceForm.contractFileUrl} onChange={(event) => setComplianceForm({ ...complianceForm, contractFileUrl: event.target.value })} className={inputClass} disabled={!complianceForm.requiresContract} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Validade da certidao</label>
                                        <input type="date" value={complianceForm.negativeCertificateExpiresAt} onChange={(event) => setComplianceForm({ ...complianceForm, negativeCertificateExpiresAt: event.target.value })} className={inputClass} disabled={!complianceForm.requiresNegativeCertificate} />
                                    </div>
                                </div>
                                <button type="submit" disabled={saving === 'regularize' || payment.status === 'PAID' || payment.status === 'CANCELED'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    <Save size={16} />
                                    Salvar regularizacao
                                </button>
                            </form>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                            <form onSubmit={approve} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <ShieldCheck size={18} />
                                    <h3 className="font-semibold">Aprovacao conjunta</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Usuario aprovador</label>
                                        <input value={approvalForm.approvedById} onChange={(event) => setApprovalForm({ ...approvalForm, approvedById: event.target.value })} className={inputClass} placeholder="Opcional: ID do usuario" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Papel institucional</label>
                                        <select value={approvalForm.role} onChange={(event) => setApprovalForm({ ...approvalForm, role: event.target.value as PaymentApprovalRole })} className={inputClass}>
                                            {Object.entries(paymentApprovalRoleLabels).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Observacoes</label>
                                        <textarea value={approvalForm.notes} onChange={(event) => setApprovalForm({ ...approvalForm, notes: event.target.value })} className={`${inputClass} min-h-20`} />
                                    </div>
                                </div>
                                <div className="mt-5 grid gap-3 md:grid-cols-2">
                                    <button type="submit" disabled={saving === 'approve' || payment.status === 'PAID'} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                                        <CheckCircle size={16} />
                                        Aprovar
                                    </button>
                                    <button type="button" onClick={reject} disabled={saving === 'reject' || payment.status === 'PAID'} className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-500/50 px-4 py-2.5 text-sm font-medium text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60">
                                        <XCircle size={16} />
                                        Rejeitar
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <h3 className="mb-5 font-semibold text-slate-100">Aprovacoes registradas</h3>
                                {payment.approvals.length === 0 ? (
                                    <p className="text-sm text-slate-400">Nenhuma aprovacao registrada.</p>
                                ) : (
                                    <div className="divide-y divide-slate-800">
                                        {payment.approvals.map((approval) => (
                                            <div key={approval.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                                                <div>
                                                    <div className="font-medium text-slate-100">{approval.approvedBy?.name || approval.approvedById}</div>
                                                    <div className="text-xs text-slate-500">{paymentApprovalRoleLabels[approval.role]} · {formatDate(approval.createdAt)}</div>
                                                </div>
                                                <span className={approval.decision === 'APPROVED' ? 'text-emerald-300' : 'text-rose-300'}>
                                                    {approval.decision === 'APPROVED' ? 'Aprovado' : 'Rejeitado'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <Wallet size={18} />
                                    <h3 className="font-semibold">Baixa financeira</h3>
                                </div>
                                <label className={labelClass}>Data do pagamento</label>
                                <input type="date" value={paidAt} onChange={(event) => setPaidAt(event.target.value)} className={inputClass} />
                                <button type="button" onClick={pay} disabled={saving === 'pay' || payment.status !== 'APPROVED'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    <Save size={16} />
                                    Baixar pagamento
                                </button>
                                {payment.paidAt && <p className="mt-3 text-sm text-emerald-300">Pago em {formatDate(payment.paidAt)}.</p>}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Pagamento nao encontrado.</div>
                )}
            </div>
        </InstitutionalLayout>
    );
}
