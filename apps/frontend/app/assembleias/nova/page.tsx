'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { AssemblyType } from '@/types/dtos';
import { assemblyTypeLabels, DEFAULT_ASSOCIATION_ID } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Plus, Save, Trash2 } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function NewAssemblyPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [agenda, setAgenda] = useState([{ value: '' }]);
    const [formData, setFormData] = useState({
        associationId: DEFAULT_ASSOCIATION_ID,
        type: 'AGE' as AssemblyType,
        title: 'Assembleia Geral Extraordinaria',
        date: '',
        firstCallAt: '',
        secondCallAt: '',
        callMethod: 'E-mail e meios eletronicos',
        convenerType: 'Diretor Presidente',
        location: '',
        address: '',
        callNoticeText: ''
    });

    function updateAgenda(index: number, value: string) {
        setAgenda((items) => items.map((item, current) => current === index ? { value } : item));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await api.callAssembly({
                ...formData,
                date: new Date(formData.date).toISOString(),
                firstCallAt: formData.firstCallAt ? new Date(formData.firstCallAt).toISOString() : undefined,
                secondCallAt: formData.secondCallAt ? new Date(formData.secondCallAt).toISOString() : undefined,
                callNoticeText: formData.callNoticeText || undefined,
                location: formData.location || undefined,
                address: formData.address || undefined,
                agenda: agenda.filter((item) => item.value.trim().length > 0)
            });
            setSuccess(true);
            setTimeout(() => router.push(`/assembleias/${response.id}`), 700);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao convocar assembleia.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <InstitutionalLayout title="Nova assembleia" activePath="/assembleias/nova">
            <div className="mx-auto max-w-5xl space-y-6">
                <Link href="/assembleias" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Convocar assembleia</h2>
                    <p className="mt-1 text-sm text-slate-400">Convocacao estatutaria com pauta, local e primeira/segunda chamada.</p>
                </div>

                {(error || success) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${success
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {success ? 'Assembleia convocada.' : error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Associacao</label>
                            <input required value={formData.associationId} onChange={(event) => setFormData({ ...formData, associationId: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Tipo</label>
                            <select value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value as AssemblyType })} className={inputClass}>
                                {Object.entries(assemblyTypeLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Titulo</label>
                            <input required value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Data e hora principal</label>
                            <input required type="datetime-local" value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Convocante</label>
                            <input required value={formData.convenerType} onChange={(event) => setFormData({ ...formData, convenerType: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Primeira chamada</label>
                            <input type="datetime-local" value={formData.firstCallAt} onChange={(event) => setFormData({ ...formData, firstCallAt: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Segunda chamada</label>
                            <input type="datetime-local" value={formData.secondCallAt} onChange={(event) => setFormData({ ...formData, secondCallAt: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Meio de convocacao</label>
                            <input required value={formData.callMethod} onChange={(event) => setFormData({ ...formData, callMethod: event.target.value })} className={inputClass} />
                        </div>

                        <div>
                            <label className={labelClass}>Local</label>
                            <input value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} className={inputClass} />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Endereco</label>
                            <input value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} className={inputClass} />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Texto ou observacao da convocacao</label>
                            <textarea value={formData.callNoticeText} onChange={(event) => setFormData({ ...formData, callNoticeText: event.target.value })} className={`${inputClass} min-h-24`} />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Ordem do dia</label>
                            <div className="space-y-3">
                                {agenda.map((item, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            required
                                            value={item.value}
                                            onChange={(event) => updateAgenda(index, event.target.value)}
                                            className={inputClass}
                                            placeholder={`Item ${index + 1}`}
                                        />
                                        {agenda.length > 1 && (
                                            <button type="button" onClick={() => setAgenda((items) => items.filter((_, current) => current !== index))} className="rounded-lg border border-slate-700 px-3 text-slate-300 hover:bg-slate-800" aria-label="Remover item">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={() => setAgenda((items) => [...items, { value: '' }])} className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-300 hover:text-blue-200">
                                <Plus size={16} />
                                Adicionar item
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">
                        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                            <Save size={17} />
                            {saving ? 'Salvando...' : 'Convocar'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
