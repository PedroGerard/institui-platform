'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { GovernanceBodyCategory } from '@/types/dtos';
import { governanceBodyCategoryLabels } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Save } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function NewGovernanceBodyPage() {
    const router = useRouter();
    const { associationId, hasAssociation } = useActiveAssociation();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'CONSULTATIVE_COUNCIL' as GovernanceBodyCategory,
        description: '',
        isStatutory: true,
        isActive: true
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            if (!associationId) {
                throw new Error('Defina a associacao ativa antes de criar um orgao.');
            }

            await api.createGovernanceBody({
                ...formData,
                associationId,
                description: formData.description || undefined
            });
            setSuccess(true);
            setTimeout(() => router.push('/orgaos'), 700);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao criar orgao.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <InstitutionalLayout title="Novo orgao" activePath="/orgaos/novo">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link href="/orgaos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Configurar orgao</h2>
                    <p className="mt-1 text-sm text-slate-400">Cadastre diretorias, conselhos, comites e nucleos previstos na governanca da entidade.</p>
                </div>

                {(error || success) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${success
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {success ? 'Orgao criado com sucesso.' : error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="Informe a associacao ativa no topo antes de cadastrar um orgao de governanca." />}

                <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Associacao</label>
                            <input
                                readOnly
                                value={associationId}
                                className={inputClass}
                                placeholder="Defina no seletor superior"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Nome do orgao</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                                className={inputClass}
                                placeholder="Conselho Consultivo"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Categoria</label>
                            <select
                                value={formData.category}
                                onChange={(event) => setFormData({ ...formData, category: event.target.value as GovernanceBodyCategory })}
                                className={inputClass}
                            >
                                {Object.entries(governanceBodyCategoryLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Finalidade</label>
                            <textarea
                                value={formData.description}
                                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                                className={`${inputClass} min-h-28`}
                                placeholder="Finalidade consultiva, cientifica, tecnica, de projetos ou pesquisa."
                            />
                        </div>

                        <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                            <input
                                type="checkbox"
                                checked={formData.isStatutory}
                                onChange={(event) => setFormData({ ...formData, isStatutory: event.target.checked })}
                                className="h-4 w-4"
                            />
                            Previsto em estatuto ou regimento
                        </label>

                        <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(event) => setFormData({ ...formData, isActive: event.target.checked })}
                                className="h-4 w-4"
                            />
                            Orgao ativo
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">
                        <button
                            type="submit"
                            disabled={saving || !hasAssociation}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={17} />
                            {saving ? 'Salvando...' : 'Salvar orgao'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
