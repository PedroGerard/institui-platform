'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { InstrumentType } from '@/types/dtos';
import { instrumentTypeLabels } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Save } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";
const instruments = Object.keys(instrumentTypeLabels) as InstrumentType[];

export default function NewAccountabilityProjectPage() {
    const router = useRouter();
    const { associationId, hasAssociation } = useActiveAssociation();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        grantor: '',
        instrumentType: 'CONVENIO' as InstrumentType,
        instrumentNumber: '',
        periodStart: '',
        periodEnd: '',
        bankAccountId: ''
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            if (!associationId) {
                throw new Error('Defina a associacao ativa antes de criar uma prestacao de contas.');
            }

            const project = await api.createAccountabilityProject({
                ...formData,
                associationId,
                instrumentNumber: formData.instrumentNumber || undefined,
                bankAccountId: formData.bankAccountId || undefined
            });
            setSuccess(true);
            setTimeout(() => router.push(`/prestacao-contas/${project.id}`), 700);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao criar prestacao.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <InstitutionalLayout title="Nova prestacao" activePath="/prestacao-contas/nova">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link href="/prestacao-contas" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Criar prestacao de contas</h2>
                    <p className="mt-1 text-sm text-slate-400">Cadastre o instrumento e o periodo de execucao.</p>
                </div>

                {(error || success) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${success
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {success ? 'Prestacao criada com sucesso.' : error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="Informe a associacao ativa no topo antes de criar uma prestacao de contas." />}

                <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Associacao</label>
                            <input readOnly value={associationId} className={inputClass} placeholder="Defina no seletor superior" />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Nome</label>
                            <input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Concedente</label>
                            <input required value={formData.grantor} onChange={(event) => setFormData({ ...formData, grantor: event.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Tipo de instrumento</label>
                            <select value={formData.instrumentType} onChange={(event) => setFormData({ ...formData, instrumentType: event.target.value as InstrumentType })} className={inputClass}>
                                {instruments.map((instrument) => <option key={instrument} value={instrument}>{instrumentTypeLabels[instrument]}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Numero do instrumento</label>
                            <input value={formData.instrumentNumber} onChange={(event) => setFormData({ ...formData, instrumentNumber: event.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Conta bancaria vinculada</label>
                            <input value={formData.bankAccountId} onChange={(event) => setFormData({ ...formData, bankAccountId: event.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Periodo inicial</label>
                            <input required type="date" value={formData.periodStart} onChange={(event) => setFormData({ ...formData, periodStart: event.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Periodo final</label>
                            <input required type="date" value={formData.periodEnd} onChange={(event) => setFormData({ ...formData, periodEnd: event.target.value })} className={inputClass} />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">
                        <button type="submit" disabled={saving || !hasAssociation} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                            <Save size={17} />
                            {saving ? 'Salvando...' : 'Salvar prestacao'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
