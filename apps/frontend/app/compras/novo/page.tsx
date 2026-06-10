'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Save } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { ProcurementJudgmentCriterion } from '@/types/dtos';
import { DEFAULT_ASSOCIATION_ID, procurementJudgmentCriterionLabels } from '@/lib/institutional';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function NewProcurementProcessPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        title: '',
        noticeNumber: '',
        instrumentNumber: '',
        object: '',
        justification: '',
        judgmentCriterion: 'LOWEST_UNIT_PRICE' as ProcurementJudgmentCriterion,
        proposalStartDate: new Date().toISOString().slice(0, 10),
        proposalEndDate: new Date().toISOString().slice(0, 10),
        openingDate: '',
        publicationUrl: '',
        contactName: '',
        contactEmail: '',
        contactPhone: ''
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const process = await api.createProcurementProcess({
                associationId: DEFAULT_ASSOCIATION_ID,
                ...form,
                proposalStartDate: new Date(`${form.proposalStartDate}T00:00:00.000Z`).toISOString(),
                proposalEndDate: new Date(`${form.proposalEndDate}T23:59:59.000Z`).toISOString(),
                openingDate: form.openingDate ? new Date(`${form.openingDate}T00:00:00.000Z`).toISOString() : undefined,
                instrumentNumber: form.instrumentNumber || undefined,
                justification: form.justification || undefined,
                publicationUrl: form.publicationUrl || undefined,
                contactName: form.contactName || undefined,
                contactEmail: form.contactEmail || undefined,
                contactPhone: form.contactPhone || undefined
            });

            router.push(`/compras/${process.id}`);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao criar processo.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <InstitutionalLayout title="Novo Processo de Compra" activePath="/compras">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/compras" className="rounded-lg border border-slate-800 p-2 text-slate-300 hover:bg-slate-800">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Edital de Cotacao Previa</h2>
                        <p className="mt-1 text-sm text-slate-400">Dados iniciais do processo de selecao de fornecedores.</p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Titulo do processo</label>
                            <input required minLength={3} className={inputClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Numero do edital</label>
                            <input required className={inputClass} value={form.noticeNumber} onChange={(event) => setForm({ ...form, noticeNumber: event.target.value })} placeholder="001/2026" />
                        </div>
                        <div>
                            <label className={labelClass}>Instrumento / Transferegov</label>
                            <input className={inputClass} value={form.instrumentNumber} onChange={(event) => setForm({ ...form, instrumentNumber: event.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Criterio de julgamento</label>
                            <select className={inputClass} value={form.judgmentCriterion} onChange={(event) => setForm({ ...form, judgmentCriterion: event.target.value as ProcurementJudgmentCriterion })}>
                                {Object.entries(procurementJudgmentCriterionLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Objeto</label>
                        <textarea required minLength={5} className={`${inputClass} min-h-24`} value={form.object} onChange={(event) => setForm({ ...form, object: event.target.value })} />
                    </div>

                    <div>
                        <label className={labelClass}>Justificativa da contratacao</label>
                        <textarea className={`${inputClass} min-h-20`} value={form.justification} onChange={(event) => setForm({ ...form, justification: event.target.value })} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className={labelClass}>Inicio das propostas</label>
                            <input required type="date" className={inputClass} value={form.proposalStartDate} onChange={(event) => setForm({ ...form, proposalStartDate: event.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Fim das propostas</label>
                            <input required type="date" className={inputClass} value={form.proposalEndDate} onChange={(event) => setForm({ ...form, proposalEndDate: event.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Abertura/classificacao</label>
                            <input type="date" className={inputClass} value={form.openingDate} onChange={(event) => setForm({ ...form, openingDate: event.target.value })} />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={labelClass}>Publicacao do edital</label>
                            <input className={inputClass} value={form.publicationUrl} onChange={(event) => setForm({ ...form, publicationUrl: event.target.value })} placeholder="https://..." />
                        </div>
                        <div>
                            <label className={labelClass}>Responsavel pelo processo</label>
                            <input className={inputClass} value={form.contactName} onChange={(event) => setForm({ ...form, contactName: event.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>E-mail para propostas</label>
                            <input type="email" className={inputClass} value={form.contactEmail} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} />
                        </div>
                        <div>
                            <label className={labelClass}>Telefone</label>
                            <input className={inputClass} value={form.contactPhone} onChange={(event) => setForm({ ...form, contactPhone: event.target.value })} />
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-slate-800 pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={16} />
                            {saving ? 'Salvando...' : 'Criar processo'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
