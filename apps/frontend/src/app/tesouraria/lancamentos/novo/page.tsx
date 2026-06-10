'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle, Save } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { DEFAULT_ASSOCIATION_ID } from '@/lib/institutional';
import { FinancialAccount } from '@/types/financial';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function NewTransactionPage() {
    const router = useRouter();
    const [type, setType] = useState<'REVENUE' | 'EXPENSE'>('REVENUE');
    const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        description: '',
        debitAccountId: '',
        creditAccountId: '',
        documentId: ''
    });

    useEffect(() => {
        async function fetchAccounts() {
            try {
                setAccounts(await api.listFinancialAccounts(DEFAULT_ASSOCIATION_ID));
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar plano de contas.');
            }
        }

        fetchAccounts();
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.createTreasuryTransaction(type, DEFAULT_ASSOCIATION_ID, {
                ...formData,
                amount: Number(formData.amount),
                date: new Date(`${formData.date}T00:00:00.000Z`).toISOString()
            });

            setSuccess(true);
            setTimeout(() => router.push('/tesouraria'), 1200);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro inesperado ao processar o lancamento.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <InstitutionalLayout title="Novo Lancamento" activePath="/tesouraria/lancamentos">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/tesouraria" className="rounded-lg border border-slate-800 p-2 text-slate-300 hover:bg-slate-800">
                        <ArrowLeft size={18} aria-hidden="true" />
                        <span className="sr-only">Voltar para Tesouraria</span>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Registro financeiro</h2>
                        <p className="mt-1 text-sm text-slate-400">Receitas e despesas vinculadas ao plano de contas e documento habil.</p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-700">
                        <AlertCircle size={18} aria-hidden="true" />
                        {error}
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700">
                        <CheckCircle size={18} aria-hidden="true" />
                        Lancamento registrado com sucesso.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <fieldset>
                        <legend className={labelClass}>Tipo de lancamento</legend>
                        <div className="inline-flex rounded-lg border border-slate-800 bg-slate-950 p-1">
                            {(['REVENUE', 'EXPENSE'] as const).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    aria-pressed={type === option}
                                    onClick={() => setType(option)}
                                    className={`rounded-md px-5 py-2 text-sm font-semibold ${type === option ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                                >
                                    {option === 'REVENUE' ? 'Receita' : 'Despesa'}
                                </button>
                            ))}
                        </div>
                    </fieldset>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="date" className={labelClass}>Data</label>
                            <input id="date" required type="date" className={inputClass} value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} />
                        </div>
                        <div>
                            <label htmlFor="amount" className={labelClass}>Valor</label>
                            <input id="amount" required min="0.01" step="0.01" type="number" className={inputClass} value={formData.amount} onChange={(event) => setFormData({ ...formData, amount: event.target.value })} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className={labelClass}>Historico</label>
                        <input id="description" required minLength={3} className={inputClass} value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="debitAccountId" className={labelClass}>Conta de debito</label>
                            <select id="debitAccountId" required className={inputClass} value={formData.debitAccountId} onChange={(event) => setFormData({ ...formData, debitAccountId: event.target.value })}>
                                <option value="">Selecione</option>
                                {accounts.map((account) => <option key={account.id} value={account.id}>{account.code} - {account.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="creditAccountId" className={labelClass}>Conta de credito</label>
                            <select id="creditAccountId" required className={inputClass} value={formData.creditAccountId} onChange={(event) => setFormData({ ...formData, creditAccountId: event.target.value })}>
                                <option value="">Selecione</option>
                                {accounts.map((account) => <option key={account.id} value={account.id}>{account.code} - {account.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="documentId" className={labelClass}>Documento habil</label>
                        <input id="documentId" required className={inputClass} value={formData.documentId} onChange={(event) => setFormData({ ...formData, documentId: event.target.value })} placeholder="ID do documento comprobatorio" />
                    </div>

                    <div className="flex justify-end border-t border-slate-800 pt-6">
                        <button type="submit" disabled={loading} className="app-primary-button inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60">
                            <Save size={16} aria-hidden="true" />
                            {loading ? 'Gravando...' : 'Gravar lancamento'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
