'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { GovernanceRole, MemberDTO } from '@/types/dtos';
import { governanceRoleLabels } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Save } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function NewMandatePage() {
    const router = useRouter();
    const { associationId, hasAssociation } = useActiveAssociation();
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        memberId: '',
        role: 'PRESIDENT' as GovernanceRole,
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });

    const activeMembers = useMemo(
        () => members.filter((member) => member.status === 'ACTIVE'),
        [members]
    );

    useEffect(() => {
        async function loadMembers() {
            if (!associationId) {
                setMembers([]);
                setLoadingMembers(false);
                return;
            }

            try {
                setLoadingMembers(true);
                setMembers(await api.listMembers(associationId));
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar membros.');
            } finally {
                setLoadingMembers(false);
            }
        }

        loadMembers();
    }, [associationId]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            if (!associationId) {
                throw new Error('Defina a associacao ativa antes de criar um mandato.');
            }

            await api.createMandate({
                ...formData,
                associationId,
                endDate: formData.endDate || undefined
            });
            setSuccess(true);
            setTimeout(() => router.push('/mandatos'), 700);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao criar mandato.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <InstitutionalLayout title="Novo mandato" activePath="/mandatos/novo">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link href="/mandatos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Criar mandato</h2>
                    <p className="mt-1 text-sm text-slate-400">Somente membros ativos podem receber mandato.</p>
                </div>

                {(error || success) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${success
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {success ? 'Mandato criado com sucesso.' : error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="Informe a associacao ativa no topo antes de criar um mandato." />}

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

                        <div className="md:col-span-2">
                            <label className={labelClass}>Membro</label>
                            <select
                                required
                                value={formData.memberId}
                                onChange={(event) => setFormData({ ...formData, memberId: event.target.value })}
                                className={inputClass}
                                disabled={loadingMembers}
                            >
                                <option value="">{loadingMembers ? 'Carregando...' : 'Selecione um membro ativo'}</option>
                                {activeMembers.map((member) => (
                                    <option key={member.id} value={member.id}>{member.fullName}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Cargo</label>
                            <select
                                value={formData.role}
                                onChange={(event) => setFormData({ ...formData, role: event.target.value as GovernanceRole })}
                                className={inputClass}
                            >
                                {Object.entries(governanceRoleLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Inicio</label>
                            <input
                                required
                                type="date"
                                value={formData.startDate}
                                onChange={(event) => setFormData({ ...formData, startDate: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Fim previsto</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(event) => setFormData({ ...formData, endDate: event.target.value })}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">
                        <button
                            type="submit"
                            disabled={saving || !hasAssociation || activeMembers.length === 0}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={17} />
                            {saving ? 'Salvando...' : 'Salvar mandato'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
