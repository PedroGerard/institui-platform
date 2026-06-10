'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { MemberDTO, MemberStatus } from '@/types/dtos';
import { formatDate, memberStatusLabels, memberTypeLabels } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Save, UserRound } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function MemberDetailPage() {
    const params = useParams<{ id: string }>();
    const [member, setMember] = useState<MemberDTO | null>(null);
    const [status, setStatus] = useState<MemberStatus>('ACTIVE');
    const [resignationDate, setResignationDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function loadMember() {
            try {
                setLoading(true);
                setError(null);
                const data = await api.getMember(params.id);
                setMember(data);
                setStatus(data.status);
                setResignationDate(data.resignationDate ? data.resignationDate.slice(0, 10) : '');
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar membro.');
            } finally {
                setLoading(false);
            }
        }

        loadMember();
    }, [params.id]);

    async function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const updated = await api.updateMemberStatus(params.id, {
                status,
                resignationDate: resignationDate || undefined
            });
            setMember(updated);
            setSuccess(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar status.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <InstitutionalLayout title="Detalhe do membro" activePath="/membros">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link href="/membros" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
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
                        Status atualizado.
                    </div>
                )}

                {loading ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-10 text-center text-sm text-slate-400">Carregando membro...</div>
                ) : member ? (
                    <>
                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/15 text-blue-300">
                                    <UserRound size={24} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="break-words text-2xl font-bold text-slate-100">{member.fullName}</h2>
                                    <p className="mt-1 text-sm text-slate-400">{memberTypeLabels[member.memberType]} desde {formatDate(member.admissionDate)}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${member.status === 'ACTIVE'
                                    ? 'bg-emerald-500/10 text-emerald-300'
                                    : 'bg-slate-700 text-slate-300'
                                    }`}>
                                    {memberStatusLabels[member.status]}
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase text-slate-500">CPF</p>
                                    <p className="mt-1 font-mono text-sm text-slate-200">{member.cpf}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-slate-500">RG</p>
                                    <p className="mt-1 text-sm text-slate-200">{member.rg || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-slate-500">Nascimento</p>
                                    <p className="mt-1 text-sm text-slate-200">{formatDate(member.birthDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase text-slate-500">Contato</p>
                                    <p className="mt-1 break-words text-sm text-slate-200">{member.email || member.phone || '-'}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleStatusSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                            <h3 className="text-lg font-semibold text-slate-100">Status do membro</h3>
                            <div className="mt-5 grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select
                                        value={status}
                                        onChange={(event) => setStatus(event.target.value as MemberStatus)}
                                        className={inputClass}
                                    >
                                        {Object.entries(memberStatusLabels).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Data de desligamento</label>
                                    <input
                                        type="date"
                                        value={resignationDate}
                                        onChange={(event) => setResignationDate(event.target.value)}
                                        className={inputClass}
                                        disabled={status === 'ACTIVE'}
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
                                    {saving ? 'Salvando...' : 'Salvar status'}
                                </button>
                            </div>
                        </form>
                    </>
                ) : null}
            </div>
        </InstitutionalLayout>
    );
}
