'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle, Save } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { FinancialAccount } from '@/types/financial';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function NewPaymentRequestPage() {
    const router = useRouter();
    const { associationId, hasAssociation } = useActiveAssociation();
    const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
    const [loadingRefs, setLoadingRefs] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        payeeName: '',
        description: '',
        amount: '',
        dueDate: '',
        documentId: '',
        accountabilityProjectId: '',
        fundId: '',
        debitAccountId: '',
        creditAccountId: '',
        requiresContract: false,
        contractFileUrl: '',
        requiresNegativeCertificate: false,
        negativeCertificateExpiresAt: ''
    });

    const expenseAccounts = useMemo(() => accounts.filter((account) => account.type === 'EXPENSE' && account.isAnalytic), [accounts]);
    const cashAccounts = useMemo(() => accounts.filter((account) => account.type === 'ASSET' && account.isAnalytic), [accounts]);

    useEffect(() => {
        async function loadAccounts() {
            if (!associationId) {
                setAccounts([]);
                setLoadingRefs(false);
                return;
            }

            try {
                setLoadingRefs(true);
                setAccounts(await api.listFinancialAccounts(associationId));
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar contas financeiras.');
            } finally {
                setLoadingRefs(false);
            }
        }

        loadAccounts();
    }, [associationId]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            if (!associationId) {
                throw new Error('Defina a associacao ativa antes de solicitar pagamento.');
            }

            const payment = await api.createPaymentRequest({
                associationId,
                accountabilityProjectId: formData.accountabilityProjectId || undefined,
                documentId: formData.documentId || undefined,
                fundId: formData.fundId || undefined,
                debitAccountId: formData.debitAccountId,
                creditAccountId: formData.creditAccountId,
                payeeName: formData.payeeName,
                description: formData.description,
                amount: Number(formData.amount),
                dueDate: formData.dueDate || undefined,
                requiresContract: formData.requiresContract,
                contractFileUrl: formData.contractFileUrl || undefined,
                requiresNegativeCertificate: formData.requiresNegativeCertificate,
                negativeCertificateExpiresAt: formData.negativeCertificateExpiresAt || undefined
            });
            setSuccess(true);
            setTimeout(() => router.push(`/tesouraria/pagamentos/${payment.id}`), 700);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao solicitar pagamento.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <InstitutionalLayout title="Novo pagamento" activePath="/tesouraria/pagamentos">
            <div className="mx-auto max-w-5xl space-y-6">
                <Link href="/tesouraria/pagamentos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Solicitar pagamento</h2>
                    <p className="mt-1 text-sm text-slate-400">O pagamento so sera baixado apos documento habil, bloqueios resolvidos e duas aprovacoes.</p>
                </div>

                {(error || success) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${success
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {success ? 'Solicitacao criada.' : error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="Informe a associacao ativa no topo antes de solicitar pagamento." />}

                <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Associacao</label>
                            <input readOnly value={associationId} className={inputClass} placeholder="Defina no seletor superior" />
                        </div>

                        <div>
                            <label className={labelClass}>Favorecido</label>
                            <input required value={formData.payeeName} onChange={(event) => setFormData({ ...formData, payeeName: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Valor</label>
                            <input required type="number" min="0.01" step="0.01" value={formData.amount} onChange={(event) => setFormData({ ...formData, amount: event.target.value })} className={inputClass} />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Descricao</label>
                            <input required value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Conta de despesa</label>
                            <select required disabled={loadingRefs} value={formData.debitAccountId} onChange={(event) => setFormData({ ...formData, debitAccountId: event.target.value })} className={inputClass}>
                                <option value="">Selecione</option>
                                {expenseAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>{account.code} - {account.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Conta de saida</label>
                            <select required disabled={loadingRefs} value={formData.creditAccountId} onChange={(event) => setFormData({ ...formData, creditAccountId: event.target.value })} className={inputClass}>
                                <option value="">Selecione</option>
                                {cashAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>{account.code} - {account.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Vencimento</label>
                            <input type="date" value={formData.dueDate} onChange={(event) => setFormData({ ...formData, dueDate: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Documento habil</label>
                            <input value={formData.documentId} onChange={(event) => setFormData({ ...formData, documentId: event.target.value })} className={inputClass} placeholder="ID do documento" />
                        </div>

                        <div>
                            <label className={labelClass}>Projeto de prestacao</label>
                            <input value={formData.accountabilityProjectId} onChange={(event) => setFormData({ ...formData, accountabilityProjectId: event.target.value })} className={inputClass} placeholder="Opcional" />
                        </div>

                        <div>
                            <label className={labelClass}>Fundo</label>
                            <input value={formData.fundId} onChange={(event) => setFormData({ ...formData, fundId: event.target.value })} className={inputClass} placeholder="Opcional" />
                        </div>
                    </div>

                    <div className="mt-6 grid gap-5 border-t border-slate-800 pt-6 md:grid-cols-2">
                        <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                            <input type="checkbox" checked={formData.requiresContract} onChange={(event) => setFormData({ ...formData, requiresContract: event.target.checked })} />
                            Exigir contrato vinculado
                        </label>
                        <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
                            <input type="checkbox" checked={formData.requiresNegativeCertificate} onChange={(event) => setFormData({ ...formData, requiresNegativeCertificate: event.target.checked })} />
                            Exigir certidao negativa valida
                        </label>
                        <div>
                            <label className={labelClass}>URL do contrato</label>
                            <input value={formData.contractFileUrl} onChange={(event) => setFormData({ ...formData, contractFileUrl: event.target.value })} className={inputClass} disabled={!formData.requiresContract} />
                        </div>
                        <div>
                            <label className={labelClass}>Validade da certidao</label>
                            <input type="date" value={formData.negativeCertificateExpiresAt} onChange={(event) => setFormData({ ...formData, negativeCertificateExpiresAt: event.target.value })} className={inputClass} disabled={!formData.requiresNegativeCertificate} />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">
                        <button type="submit" disabled={saving || !hasAssociation} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                            <Save size={17} />
                            {saving ? 'Salvando...' : 'Salvar solicitacao'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
