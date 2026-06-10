'use client';

import { FormEvent, use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { GovernanceBodyDTO, GovernanceBodyMemberRole, MemberDTO } from '@/types/dtos';
import { formatDate, governanceBodyCategoryLabels, governanceBodyMemberRoleLabels } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Plus, UserRound, XCircle } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function GovernanceBodyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [body, setBody] = useState<GovernanceBodyDTO | null>(null);
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [closingId, setClosingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        memberId: '',
        externalName: '',
        externalEmail: '',
        role: 'MEMBER' as GovernanceBodyMemberRole,
        roleName: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });

    const activeMembers = useMemo(
        () => members.filter((member) => member.status === 'ACTIVE'),
        [members]
    );

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const [bodyData, memberData] = await Promise.all([
                api.getGovernanceBody(id),
                api.listMembers()
            ]);
            setBody(bodyData);
            setMembers(memberData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar orgao.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [id]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await api.addGovernanceBodyMember(id, {
                memberId: formData.memberId || undefined,
                externalName: formData.memberId ? undefined : formData.externalName || undefined,
                externalEmail: formData.memberId ? undefined : formData.externalEmail || undefined,
                role: formData.role,
                roleName: formData.roleName || undefined,
                startDate: formData.startDate,
                endDate: formData.endDate || undefined
            });
            setSuccess('Integrante adicionado.');
            setFormData({
                memberId: '',
                externalName: '',
                externalEmail: '',
                role: 'MEMBER',
                roleName: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: ''
            });
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao adicionar integrante.');
        } finally {
            setSaving(false);
        }
    }

    async function closeMember(memberId: string) {
        try {
            setClosingId(memberId);
            setError(null);
            setSuccess(null);
            await api.closeGovernanceBodyMember(memberId, new Date().toISOString().slice(0, 10));
            setSuccess('Participacao encerrada.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao encerrar participacao.');
        } finally {
            setClosingId(null);
        }
    }

    return (
        <InstitutionalLayout title="Orgao de governanca" activePath="/orgaos">
            <div className="mx-auto max-w-6xl space-y-6">
                <Link href="/orgaos" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft size={16} />
                    Voltar
                </Link>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                        <CheckCircle size={18} />
                        {success}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Carregando orgao...</div>
                ) : body ? (
                    <>
                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-100">{body.name}</h2>
                                    <p className="mt-1 text-sm text-slate-400">{governanceBodyCategoryLabels[body.category]}</p>
                                    {body.description && <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">{body.description}</p>}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${body.isActive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                                        {body.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                    {body.isStatutory && (
                                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">Estatutario</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
                            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                                <div className="min-w-[780px]">
                                    <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_120px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                                        <span>Integrante</span>
                                        <span>Funcao</span>
                                        <span>Inicio</span>
                                        <span>Status</span>
                                        <span className="text-right">Acoes</span>
                                    </div>

                                    {body.members.length === 0 ? (
                                        <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                            <UserRound size={28} />
                                            <span className="text-sm">Nenhum integrante cadastrado.</span>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-800">
                                            {body.members.map((item) => (
                                                <div key={item.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_120px] items-center gap-4 px-5 py-4 text-sm">
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-slate-100">{item.member?.fullName || item.externalName}</p>
                                                        <p className="truncate text-xs text-slate-500">{item.member?.email || item.externalEmail || (item.member ? 'Membro cadastrado' : 'Participante externo')}</p>
                                                    </div>
                                                    <span className="text-slate-300">{item.roleName || governanceBodyMemberRoleLabels[item.role]}</span>
                                                    <span className="text-slate-300">{formatDate(item.startDate)}</span>
                                                    <span>
                                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.isActive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                                                            {item.isActive ? 'Ativo' : 'Encerrado'}
                                                        </span>
                                                    </span>
                                                    <div className="flex justify-end">
                                                        {item.isActive && (
                                                            <button
                                                                type="button"
                                                                onClick={() => closeMember(item.id)}
                                                                disabled={closingId === item.id}
                                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60"
                                                            >
                                                                <XCircle size={14} />
                                                                Encerrar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <Plus size={18} />
                                    <h3 className="font-semibold">Adicionar integrante</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Membro cadastrado</label>
                                        <select
                                            value={formData.memberId}
                                            onChange={(event) => setFormData({ ...formData, memberId: event.target.value, externalName: '', externalEmail: '' })}
                                            className={inputClass}
                                        >
                                            <option value="">Participante externo ou selecione um membro</option>
                                            {activeMembers.map((member) => (
                                                <option key={member.id} value={member.id}>{member.fullName}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {!formData.memberId && (
                                        <>
                                            <div>
                                                <label className={labelClass}>Nome externo</label>
                                                <input
                                                    value={formData.externalName}
                                                    onChange={(event) => setFormData({ ...formData, externalName: event.target.value })}
                                                    className={inputClass}
                                                    placeholder="Especialista convidado"
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>E-mail externo</label>
                                                <input
                                                    type="email"
                                                    value={formData.externalEmail}
                                                    onChange={(event) => setFormData({ ...formData, externalEmail: event.target.value })}
                                                    className={inputClass}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className={labelClass}>Funcao</label>
                                        <select
                                            value={formData.role}
                                            onChange={(event) => setFormData({ ...formData, role: event.target.value as GovernanceBodyMemberRole })}
                                            className={inputClass}
                                        >
                                            {Object.entries(governanceBodyMemberRoleLabels).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Funcao personalizada</label>
                                        <input
                                            value={formData.roleName}
                                            onChange={(event) => setFormData({ ...formData, roleName: event.target.value })}
                                            className={inputClass}
                                            placeholder="Coordenador tecnico, parecerista, pesquisador..."
                                        />
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
                                </div>

                                <div className="mt-6 border-t border-slate-800 pt-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Plus size={17} />
                                        {saving ? 'Salvando...' : 'Adicionar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Orgao nao encontrado.</div>
                )}
            </div>
        </InstitutionalLayout>
    );
}
