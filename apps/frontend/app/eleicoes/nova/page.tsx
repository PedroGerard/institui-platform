'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { AssemblyDTO, GovernanceBodyDTO } from '@/types/dtos';
import { DEFAULT_ASSOCIATION_ID, assemblyTypeLabels, formatDate, governanceBodyCategoryLabels } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Save } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function NewElectionPage() {
    const router = useRouter();
    const [assemblies, setAssemblies] = useState<AssemblyDTO[]>([]);
    const [bodies, setBodies] = useState<GovernanceBodyDTO[]>([]);
    const [loadingRefs, setLoadingRefs] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        associationId: DEFAULT_ASSOCIATION_ID,
        assemblyId: '',
        governanceBodyId: '',
        title: '',
        description: '',
        termStartDate: new Date().toISOString().split('T')[0],
        termEndDate: ''
    });

    useEffect(() => {
        async function loadRefs() {
            try {
                setLoadingRefs(true);
                const [assemblyData, bodyData] = await Promise.all([
                    api.listAssemblies(),
                    api.listGovernanceBodies({ active: true })
                ]);
                setAssemblies(assemblyData);
                setBodies(bodyData);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar referencias.');
            } finally {
                setLoadingRefs(false);
            }
        }

        loadRefs();
    }, []);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const election = await api.createElection({
                associationId: formData.associationId,
                assemblyId: formData.assemblyId || undefined,
                governanceBodyId: formData.governanceBodyId || undefined,
                title: formData.title,
                description: formData.description || undefined,
                termStartDate: formData.termStartDate,
                termEndDate: formData.termEndDate || undefined
            });
            setSuccess(true);
            setTimeout(() => router.push(`/eleicoes/${election.id}`), 700);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao criar eleicao.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <InstitutionalLayout title="Nova eleicao" activePath="/eleicoes/nova">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link href="/eleicoes" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Criar processo eleitoral</h2>
                    <p className="mt-1 text-sm text-slate-400">Vincule a eleicao a uma assembleia e ao orgao que recebera os mandatos.</p>
                </div>

                {(error || success) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${success
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {success ? 'Eleicao criada.' : error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className={labelClass}>Associacao</label>
                            <input
                                required
                                value={formData.associationId}
                                onChange={(event) => setFormData({ ...formData, associationId: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Titulo</label>
                            <input
                                required
                                value={formData.title}
                                onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                                className={inputClass}
                                placeholder="Eleicao da Diretoria Executiva"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Assembleia de origem</label>
                            <select
                                value={formData.assemblyId}
                                onChange={(event) => setFormData({ ...formData, assemblyId: event.target.value })}
                                className={inputClass}
                                disabled={loadingRefs}
                            >
                                <option value="">Sem vinculo</option>
                                {assemblies.map((assembly) => (
                                    <option key={assembly.id} value={assembly.id}>
                                        {(assembly.title || assemblyTypeLabels[assembly.type])} - {formatDate(assembly.scheduledDate)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Orgao eleito</label>
                            <select
                                value={formData.governanceBodyId}
                                onChange={(event) => setFormData({ ...formData, governanceBodyId: event.target.value })}
                                className={inputClass}
                                disabled={loadingRefs}
                            >
                                <option value="">Nao vincular</option>
                                {bodies.map((body) => (
                                    <option key={body.id} value={body.id}>
                                        {body.name} - {governanceBodyCategoryLabels[body.category]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Inicio do mandato</label>
                            <input
                                required
                                type="date"
                                value={formData.termStartDate}
                                onChange={(event) => setFormData({ ...formData, termStartDate: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Fim previsto</label>
                            <input
                                type="date"
                                value={formData.termEndDate}
                                onChange={(event) => setFormData({ ...formData, termEndDate: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>Observacoes</label>
                            <textarea
                                value={formData.description}
                                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                                className={`${inputClass} min-h-28`}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={17} />
                            {saving ? 'Salvando...' : 'Salvar eleicao'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
