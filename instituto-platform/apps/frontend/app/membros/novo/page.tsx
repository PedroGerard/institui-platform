'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { MemberType } from '@/types/dtos';
import { memberTypeLabels } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Save } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function NewMemberPage() {
    const router = useRouter();
    const { associationId, hasAssociation } = useActiveAssociation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        cpf: '',
        rg: '',
        birthDate: '',
        email: '',
        phone: '',
        memberType: 'EFFECTIVE' as MemberType,
        admissionDate: new Date().toISOString().split('T')[0]
    });

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (!associationId) {
                throw new Error('Defina a associacao ativa antes de cadastrar um membro.');
            }

            await api.createMember({ ...formData, associationId });
            setSuccess(true);
            setTimeout(() => router.push('/membros'), 700);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao cadastrar membro.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <InstitutionalLayout title="Novo membro" activePath="/membros/novo">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link href="/membros" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Cadastrar membro</h2>
                    <p className="mt-1 text-sm text-slate-400">CPF unico dentro da associacao.</p>
                </div>

                {(error || success) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${success
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {success ? 'Membro cadastrado com sucesso.' : error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="Informe a associacao ativa no topo antes de cadastrar um membro." />}

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
                            <label className={labelClass}>Nome completo</label>
                            <input
                                required
                                minLength={3}
                                value={formData.fullName}
                                onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>CPF</label>
                            <input
                                required
                                value={formData.cpf}
                                onChange={(event) => setFormData({ ...formData, cpf: event.target.value })}
                                className={inputClass}
                                placeholder="000.000.000-00"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>RG</label>
                            <input
                                value={formData.rg}
                                onChange={(event) => setFormData({ ...formData, rg: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Nascimento</label>
                            <input
                                required
                                type="date"
                                value={formData.birthDate}
                                onChange={(event) => setFormData({ ...formData, birthDate: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Admissao</label>
                            <input
                                required
                                type="date"
                                value={formData.admissionDate}
                                onChange={(event) => setFormData({ ...formData, admissionDate: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Telefone</label>
                            <input
                                value={formData.phone}
                                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Tipo</label>
                            <select
                                value={formData.memberType}
                                onChange={(event) => setFormData({ ...formData, memberType: event.target.value as MemberType })}
                                className={inputClass}
                            >
                                {Object.entries(memberTypeLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">
                        <button
                            type="submit"
                            disabled={loading || !hasAssociation}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save size={17} />
                            {loading ? 'Salvando...' : 'Salvar membro'}
                        </button>
                    </div>
                </form>
            </div>
        </InstitutionalLayout>
    );
}
