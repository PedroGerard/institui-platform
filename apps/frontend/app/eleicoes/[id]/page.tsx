'use client';

import { FormEvent, use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { ElectionDTO, ElectionSlateDTO, GovernanceRole, MemberDTO } from '@/types/dtos';
import { electionSlateStatusLabels, electionStatusLabels, formatDate, governanceRoleLabels, memberStatusLabels } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Plus, Save, ShieldCheck, UserPlus, Vote } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function ElectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { associationId, hasAssociation } = useActiveAssociation();
    const [election, setElection] = useState<ElectionDTO | null>(null);
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [votesBySlate, setVotesBySlate] = useState<Record<string, string>>({});
    const [slateForm, setSlateForm] = useState({
        name: '',
        number: ''
    });
    const [candidateForm, setCandidateForm] = useState({
        slateId: '',
        memberId: '',
        role: 'DIRECTOR_PRESIDENT' as GovernanceRole,
        roleName: '',
        seatName: ''
    });

    const activeMembers = useMemo(() => members.filter((member) => member.status === 'ACTIVE'), [members]);
    const electedSlate = election?.slates.find((slate) => slate.status === 'ELECTED');

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const electionData = await api.getElection(id);
            const memberData = await api.listMembers(associationId || electionData.associationId);
            setElection(electionData);
            setMembers(memberData);
            setVotesBySlate(Object.fromEntries(electionData.slates.map((slate) => [slate.id, slate.votes ? String(slate.votes) : ''])));
            setCandidateForm((current) => ({
                ...current,
                slateId: current.slateId || electionData.slates[0]?.id || ''
            }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar eleicao.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [associationId, id]);

    async function addSlate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving('slate');
        setError(null);
        setSuccess(null);

        try {
            const slate = await api.addElectionSlate(id, {
                name: slateForm.name,
                number: slateForm.number || undefined
            });
            setSlateForm({ name: '', number: '' });
            setCandidateForm((current) => ({ ...current, slateId: slate.id }));
            setSuccess('Chapa registrada.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao registrar chapa.');
        } finally {
            setSaving(null);
        }
    }

    async function addCandidate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving('candidate');
        setError(null);
        setSuccess(null);

        try {
            await api.addElectionCandidate(candidateForm.slateId, {
                memberId: candidateForm.memberId,
                role: candidateForm.role,
                roleName: candidateForm.roleName || undefined,
                seatName: candidateForm.seatName || undefined
            });
            setCandidateForm((current) => ({
                ...current,
                memberId: '',
                seatName: '',
                roleName: ''
            }));
            setSuccess('Candidato incluido na chapa.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao incluir candidato.');
        } finally {
            setSaving(null);
        }
    }

    async function approveSlate(slate: ElectionSlateDTO) {
        setSaving(`approve-${slate.id}`);
        setError(null);
        setSuccess(null);

        try {
            await api.approveElection(id, {
                slateId: slate.id,
                votes: votesBySlate[slate.id] ? Number(votesBySlate[slate.id]) : undefined
            });
            setSuccess(`Chapa ${slate.name} homologada.`);
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao homologar chapa.');
        } finally {
            setSaving(null);
        }
    }

    async function createMandates() {
        setSaving('mandates');
        setError(null);
        setSuccess(null);

        try {
            const mandates = await api.createElectionMandates(id);
            setSuccess(`${mandates.length} mandatos gerados a partir da eleicao.`);
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar mandatos.');
        } finally {
            setSaving(null);
        }
    }

    return (
        <InstitutionalLayout title="Eleicao" activePath="/eleicoes">
            <div className="space-y-6">
                <Link href="/eleicoes" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
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

                {!hasAssociation && <AssociationRequired message="A tela usa a associacao da eleicao para carregar membros, mas defina a associacao ativa no topo para operar eleicoes e mandatos com consistencia." />}

                {loading ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Carregando eleicao...</div>
                ) : election ? (
                    <>
                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-100">{election.title}</h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {election.governanceBody?.name || 'Orgao nao vinculado'} · inicio em {formatDate(election.termStartDate)}
                                    </p>
                                    {election.description && <p className="mt-3 max-w-4xl text-sm text-slate-300">{election.description}</p>}
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${election.status === 'MANDATES_CREATED'
                                    ? 'bg-emerald-500/10 text-emerald-300'
                                    : election.status === 'APPROVED'
                                        ? 'bg-blue-500/10 text-blue-300'
                                        : 'bg-slate-700 text-slate-300'
                                    }`}>
                                    {electionStatusLabels[election.status]}
                                </span>
                            </div>
                            <div className="mt-5 grid gap-4 text-sm md:grid-cols-4">
                                <div><span className="block text-xs uppercase text-slate-500">Assembleia</span>{election.assembly?.title || election.assembly?.type || '-'}</div>
                                <div><span className="block text-xs uppercase text-slate-500">Fim previsto</span>{formatDate(election.termEndDate)}</div>
                                <div><span className="block text-xs uppercase text-slate-500">Chapas</span>{election.slates.length}</div>
                                <div><span className="block text-xs uppercase text-slate-500">Mandatos gerados</span>{election.mandates.length}</div>
                            </div>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                            <form onSubmit={addSlate} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <Vote size={18} />
                                    <h3 className="font-semibold">Registrar chapa</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Nome da chapa</label>
                                        <input
                                            required
                                            value={slateForm.name}
                                            onChange={(event) => setSlateForm({ ...slateForm, name: event.target.value })}
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Numero</label>
                                        <input
                                            value={slateForm.number}
                                            onChange={(event) => setSlateForm({ ...slateForm, number: event.target.value })}
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={saving === 'slate' || election.status === 'MANDATES_CREATED'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    <Plus size={16} />
                                    Adicionar chapa
                                </button>
                            </form>

                            <form onSubmit={addCandidate} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <UserPlus size={18} />
                                    <h3 className="font-semibold">Incluir candidato</h3>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>Chapa</label>
                                        <select
                                            required
                                            value={candidateForm.slateId}
                                            onChange={(event) => setCandidateForm({ ...candidateForm, slateId: event.target.value })}
                                            className={inputClass}
                                        >
                                            <option value="">Selecione</option>
                                            {election.slates.map((slate) => (
                                                <option key={slate.id} value={slate.id}>{slate.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Membro</label>
                                        <select
                                            required
                                            value={candidateForm.memberId}
                                            onChange={(event) => setCandidateForm({ ...candidateForm, memberId: event.target.value })}
                                            className={inputClass}
                                        >
                                            <option value="">Selecione um membro ativo</option>
                                            {activeMembers.map((member) => (
                                                <option key={member.id} value={member.id}>{member.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Cargo</label>
                                        <select
                                            value={candidateForm.role}
                                            onChange={(event) => setCandidateForm({ ...candidateForm, role: event.target.value as GovernanceRole })}
                                            className={inputClass}
                                        >
                                            {Object.entries(governanceRoleLabels).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Assento</label>
                                        <input
                                            value={candidateForm.seatName}
                                            onChange={(event) => setCandidateForm({ ...candidateForm, seatName: event.target.value })}
                                            className={inputClass}
                                            placeholder="Titular 1, Suplente 2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Nome do cargo no estatuto</label>
                                        <input
                                            value={candidateForm.roleName}
                                            onChange={(event) => setCandidateForm({ ...candidateForm, roleName: event.target.value })}
                                            className={inputClass}
                                            placeholder="Diretor Administrativo-Financeiro"
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={saving === 'candidate' || election.slates.length === 0 || election.status === 'MANDATES_CREATED'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    <Plus size={16} />
                                    Adicionar candidato
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            {election.slates.length === 0 ? (
                                <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">
                                    Nenhuma chapa registrada.
                                </div>
                            ) : election.slates.map((slate) => (
                                <div key={slate.id} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-slate-100">{slate.name}</h3>
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${slate.status === 'ELECTED' ? 'bg-emerald-500/10 text-emerald-300' : slate.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-300' : 'bg-slate-700 text-slate-300'}`}>
                                                    {electionSlateStatusLabels[slate.status]}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500">{slate.number ? `Numero ${slate.number}` : 'Sem numero'} · {slate.candidates.length} candidatos</p>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            <input
                                                type="number"
                                                min={0}
                                                value={votesBySlate[slate.id] || ''}
                                                onChange={(event) => setVotesBySlate({ ...votesBySlate, [slate.id]: event.target.value })}
                                                className="w-32 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                                                placeholder="Votos"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => approveSlate(slate)}
                                                disabled={saving === `approve-${slate.id}` || slate.candidates.length === 0 || election.status === 'MANDATES_CREATED'}
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <CheckCircle size={16} />
                                                Homologar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-5 overflow-x-auto">
                                        <div className="min-w-[760px]">
                                            <div className="grid grid-cols-[1.3fr_1.1fr_1fr_1fr] gap-4 border-b border-slate-800 px-1 py-3 text-xs font-semibold uppercase text-slate-500">
                                                <span>Membro</span>
                                                <span>Cargo</span>
                                                <span>Assento</span>
                                                <span>Status</span>
                                            </div>
                                            {slate.candidates.length === 0 ? (
                                                <div className="px-1 py-5 text-sm text-slate-400">Chapa sem candidatos.</div>
                                            ) : slate.candidates.map((candidate) => (
                                                <div key={candidate.id} className="grid grid-cols-[1.3fr_1.1fr_1fr_1fr] items-center gap-4 border-b border-slate-800/70 px-1 py-3 text-sm last:border-b-0">
                                                    <span className="min-w-0 break-words text-slate-100">{candidate.member?.fullName || candidate.memberId}</span>
                                                    <span className="text-slate-300">{candidate.roleName || governanceRoleLabels[candidate.role]}</span>
                                                    <span className="text-slate-300">{candidate.seatName || '-'}</span>
                                                    <span className="text-slate-400">{candidate.member ? memberStatusLabels[candidate.member.status] : '-'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-slate-100">
                                        <ShieldCheck size={18} />
                                        <h3 className="font-semibold">Posse e mandatos</h3>
                                    </div>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {electedSlate ? `Chapa eleita: ${electedSlate.name}` : 'Homologue uma chapa antes de gerar mandatos.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={createMandates}
                                    disabled={saving === 'mandates' || election.status !== 'APPROVED'}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save size={16} />
                                    Gerar mandatos
                                </button>
                            </div>

                            {election.mandates.length > 0 && (
                                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {election.mandates.map((mandate) => (
                                        <div key={mandate.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm">
                                            <div className="font-medium text-slate-100">{mandate.roleName || governanceRoleLabels[mandate.role]}</div>
                                            <div className="mt-1 text-slate-500">{mandate.seatName || 'Assento unico'}</div>
                                            <div className="mt-3 text-xs text-slate-400">{formatDate(mandate.startDate)} a {formatDate(mandate.endDate)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Eleicao nao encontrada.</div>
                )}
            </div>
        </InstitutionalLayout>
    );
}
