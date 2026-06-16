'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw, Save, ShieldCheck, XCircle } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import {
    BankReconciliationSummaryDTO,
    BankStatementEntryDTO,
    BankStatementEntryStatus,
    BankStatementEntryType,
    FinancialEntryDTO
} from '@/types/dtos';
import { FinancialAccount } from '@/types/financial';
import {
    bankStatementEntryStatusLabels,
    bankStatementEntryTypeLabels,
    formatCurrency,
    formatDate
} from '@/lib/institutional';

const initialForm = {
    bankAccountId: '',
    transactionDate: new Date().toISOString().slice(0, 10),
    description: '',
    amount: '',
    type: 'DEBIT' as BankStatementEntryType,
    documentNumber: ''
};

export default function BankReconciliationPage() {
    const { associationId, hasAssociation } = useActiveAssociation();
    const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
    const [entries, setEntries] = useState<BankStatementEntryDTO[]>([]);
    const [candidates, setCandidates] = useState<FinancialEntryDTO[]>([]);
    const [summary, setSummary] = useState<BankReconciliationSummaryDTO | null>(null);
    const [status, setStatus] = useState<BankStatementEntryStatus | ''>('');
    const [form, setForm] = useState(initialForm);
    const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const bankAccounts = useMemo(() => accounts.filter((account) => account.type === 'ASSET' && account.isAnalytic), [accounts]);

    async function loadData() {
        if (!associationId) {
            setAccounts([]);
            setEntries([]);
            setSummary(null);
            setCandidates([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const [accountData, entryData, summaryData, candidateData] = await Promise.all([
                api.listFinancialAccounts(associationId),
                api.listBankStatementEntries({
                    associationId,
                    status: status || undefined
                }),
                api.getBankReconciliationSummary(associationId),
                api.listReconciliationCandidates({ associationId })
            ]);

            setAccounts(accountData);
            setEntries(entryData);
            setSummary(summaryData);
            setCandidates(candidateData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar conciliacao.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [associationId, status]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (!associationId) {
                throw new Error('Defina a associacao ativa antes de registrar movimento bancario.');
            }

            await api.createBankStatementEntry({
                associationId,
                bankAccountId: form.bankAccountId,
                transactionDate: new Date(`${form.transactionDate}T00:00:00.000Z`).toISOString(),
                description: form.description,
                amount: Number(form.amount),
                type: form.type,
                documentNumber: form.documentNumber || undefined
            });

            setForm({
                ...initialForm,
                bankAccountId: form.bankAccountId,
                type: form.type
            });
            setSuccess('Movimento bancario registrado.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao registrar movimento.');
        } finally {
            setSaving(false);
        }
    }

    async function handleReconcile(entryId: string) {
        const financialEntryId = selectedCandidates[entryId];
        if (!financialEntryId) return;

        try {
            setError(null);
            setSuccess(null);
            await api.reconcileBankStatementEntry(entryId, financialEntryId);
            setSelectedCandidates((current) => ({ ...current, [entryId]: '' }));
            setSuccess('Movimento conciliado com sucesso.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao conciliar movimento.');
        }
    }

    async function handleUnreconcile(entryId: string) {
        try {
            setError(null);
            setSuccess(null);
            await api.unreconcileBankStatementEntry(entryId);
            setSuccess('Conciliacao desfeita.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao desfazer conciliacao.');
        }
    }

    async function handleIgnore(entryId: string) {
        try {
            setError(null);
            setSuccess(null);
            await api.ignoreBankStatementEntry(entryId, 'Ignorado pela tesouraria');
            setSuccess('Movimento marcado como ignorado.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao ignorar movimento.');
        }
    }

    function compatibleCandidates(entry: BankStatementEntryDTO) {
        return candidates.filter((candidate) => {
            const sameAmount = Math.abs(Number(candidate.amount) - Number(entry.amount)) < 0.01;
            const sameAccount = entry.type === 'CREDIT'
                ? candidate.debitAccountId === entry.bankAccountId
                : candidate.creditAccountId === entry.bankAccountId;

            return sameAmount && sameAccount;
        });
    }

    function statusClass(statusValue: BankStatementEntryStatus) {
        if (statusValue === 'RECONCILED') return 'bg-emerald-500/10 text-emerald-300';
        if (statusValue === 'IGNORED') return 'bg-slate-700 text-slate-300';
        return 'bg-amber-500/10 text-amber-300';
    }

    return (
        <InstitutionalLayout title="Conciliacao Bancaria" activePath="/tesouraria/conciliacao">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Conciliacao Bancaria</h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Vincule movimentos do extrato aos lancamentos financeiros da associacao.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value as BankStatementEntryStatus | '')}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                        >
                            <option value="">Todos os status</option>
                            {Object.entries(bankStatementEntryStatusLabels).map(([value, label]) => (
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
                        <CheckCircle2 size={18} />
                        {success}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="Informe a associacao ativa no topo antes de conciliar movimentos bancarios." />}

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Pendentes</div>
                        <div className="mt-2 text-xl font-bold text-amber-300">{summary?.pendingCount || 0}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Valor pendente</div>
                        <div className="mt-2 text-xl font-bold text-slate-100">{formatCurrency(summary?.pendingAmount)}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Conciliados</div>
                        <div className="mt-2 text-xl font-bold text-emerald-300">{summary?.reconciledCount || 0}</div>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                        <div className="text-xs font-semibold uppercase text-slate-500">Conclusao</div>
                        <div className="mt-2 text-xl font-bold text-blue-300">{summary?.completionRate || 0}%</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-100">Registrar movimento do extrato</h3>
                        <span className="text-xs font-semibold uppercase text-slate-500">Entrada manual</span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-6">
                        <div className="lg:col-span-2">
                            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Conta bancaria</label>
                            <select
                                required
                                value={form.bankAccountId}
                                onChange={(event) => setForm({ ...form, bankAccountId: event.target.value })}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                            >
                                <option value="">Selecione</option>
                                {bankAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>{account.code} - {account.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Tipo</label>
                            <select
                                value={form.type}
                                onChange={(event) => setForm({ ...form, type: event.target.value as BankStatementEntryType })}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                            >
                                {Object.entries(bankStatementEntryTypeLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Data</label>
                            <input
                                required
                                type="date"
                                value={form.transactionDate}
                                onChange={(event) => setForm({ ...form, transactionDate: event.target.value })}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Valor</label>
                            <input
                                required
                                min="0.01"
                                step="0.01"
                                type="number"
                                value={form.amount}
                                onChange={(event) => setForm({ ...form, amount: event.target.value })}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase text-slate-500">Documento</label>
                            <input
                                value={form.documentNumber}
                                onChange={(event) => setForm({ ...form, documentNumber: event.target.value })}
                                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                                placeholder="Opcional"
                            />
                        </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
                        <input
                            required
                            minLength={3}
                            value={form.description}
                            onChange={(event) => setForm({ ...form, description: event.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                            placeholder="Historico do extrato bancario"
                        />
                        <button
                            type="submit"
                            disabled={saving || !hasAssociation}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={16} />
                            {saving ? 'Salvando...' : 'Registrar'}
                        </button>
                    </div>
                </form>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <table className="w-full min-w-[1100px] text-left text-sm">
                        <thead className="border-b border-slate-800 bg-slate-950/60 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Data</th>
                                <th className="px-4 py-3">Movimento</th>
                                <th className="px-4 py-3">Conta</th>
                                <th className="px-4 py-3">Valor</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Lancamento compativel</th>
                                <th className="px-4 py-3 text-right">Acao</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">Carregando conciliacao...</td>
                                </tr>
                            ) : entries.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">Nenhum movimento bancario encontrado.</td>
                                </tr>
                            ) : entries.map((entry) => {
                                const matches = compatibleCandidates(entry);

                                return (
                                    <tr key={entry.id} className="align-top hover:bg-slate-800/40">
                                        <td className="px-4 py-4 text-slate-300">{formatDate(entry.transactionDate)}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-slate-100">{entry.description}</div>
                                            <div className="mt-1 text-xs text-slate-500">{bankStatementEntryTypeLabels[entry.type]} {entry.documentNumber ? `- ${entry.documentNumber}` : ''}</div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-300">{entry.bankAccount?.code} - {entry.bankAccount?.name}</td>
                                        <td className={entry.type === 'DEBIT' ? 'px-4 py-4 font-semibold text-rose-300' : 'px-4 py-4 font-semibold text-emerald-300'}>
                                            {entry.type === 'DEBIT' ? '-' : '+'}{formatCurrency(entry.amount)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(entry.status)}`}>
                                                {bankStatementEntryStatusLabels[entry.status]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {entry.status === 'RECONCILED' && entry.financialEntry ? (
                                                <div className="text-slate-300">
                                                    <div className="font-medium text-slate-100">{entry.financialEntry.description}</div>
                                                    <div className="mt-1 text-xs text-slate-500">{formatDate(entry.financialEntry.date)} - {formatCurrency(entry.financialEntry.amount)}</div>
                                                </div>
                                            ) : entry.status === 'PENDING' ? (
                                                <select
                                                    value={selectedCandidates[entry.id] || ''}
                                                    onChange={(event) => setSelectedCandidates({ ...selectedCandidates, [entry.id]: event.target.value })}
                                                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                                                >
                                                    <option value="">{matches.length ? 'Selecione o lancamento' : 'Sem lancamento compativel'}</option>
                                                    {matches.map((candidate) => (
                                                        <option key={candidate.id} value={candidate.id}>
                                                            {formatDate(candidate.date)} - {candidate.description} - {formatCurrency(candidate.amount)}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-slate-500">Movimento ignorado</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2">
                                                {entry.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            disabled={!selectedCandidates[entry.id]}
                                                            onClick={() => handleReconcile(entry.id)}
                                                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <ShieldCheck size={14} />
                                                            Conciliar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleIgnore(entry.id)}
                                                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                                                        >
                                                            <XCircle size={14} />
                                                            Ignorar
                                                        </button>
                                                    </>
                                                )}
                                                {entry.status === 'RECONCILED' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUnreconcile(entry.id)}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                                                    >
                                                        <RefreshCw size={14} />
                                                        Desfazer
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
