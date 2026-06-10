'use client';

import { FormEvent, use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { AssemblyDTO, GeneratedDocumentDTO, MemberDTO } from '@/types/dtos';
import { assemblyStatusLabels, assemblyTypeLabels, formatDate } from '@/lib/institutional';
import { AlertCircle, ArrowLeft, CheckCircle, Download, FileText, ListChecks, Plus, Save, Users } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function AssemblyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { associationId, hasAssociation } = useActiveAssociation();
    const [assembly, setAssembly] = useState<AssemblyDTO | null>(null);
    const [members, setMembers] = useState<MemberDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [document, setDocument] = useState<GeneratedDocumentDTO | null>(null);
    const [attendanceForm, setAttendanceForm] = useState({
        memberId: '',
        externalName: '',
        hasVotingRight: true
    });
    const [holdForm, setHoldForm] = useState({
        heldCallNumber: 2,
        totalVotingMembers: 0,
        presentVotingMembers: 0,
        chairMemberId: '',
        secretaryMemberId: ''
    });
    const [deliberationForm, setDeliberationForm] = useState({
        agendaItem: '',
        decision: '',
        requiredQuorum: 'SIMPLE',
        votesFor: '',
        votesAgainst: '',
        abstentions: ''
    });
    const [minutesContent, setMinutesContent] = useState('');

    const activeMembers = useMemo(() => members.filter((member) => member.status === 'ACTIVE'), [members]);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const assemblyData = await api.getAssembly(id);
            const memberData = await api.listMembers(associationId || assemblyData.associationId);
            setAssembly(assemblyData);
            setMembers(memberData);
            setMinutesContent(assemblyData.minutesContent || '');
            setHoldForm((current) => ({
                ...current,
                totalVotingMembers: assemblyData.totalVotingMembers ?? memberData.filter((member) => member.status === 'ACTIVE').length,
                presentVotingMembers: assemblyData.presentVotingMembers ?? assemblyData.attendances.filter((item) => item.present && item.hasVotingRight).length,
                heldCallNumber: assemblyData.heldCallNumber ?? 2,
                chairMemberId: assemblyData.chairMemberId || '',
                secretaryMemberId: assemblyData.secretaryMemberId || ''
            }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar assembleia.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [associationId, id]);

    async function addAttendance(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving('attendance');
        setError(null);
        setSuccess(null);

        try {
            await api.addAssemblyAttendance(id, {
                memberId: attendanceForm.memberId || undefined,
                externalName: attendanceForm.memberId ? undefined : attendanceForm.externalName || undefined,
                hasVotingRight: attendanceForm.hasVotingRight,
                present: true,
                signedAt: new Date().toISOString()
            });
            setAttendanceForm({ memberId: '', externalName: '', hasVotingRight: true });
            setSuccess('Presenca registrada.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao registrar presenca.');
        } finally {
            setSaving(null);
        }
    }

    async function holdAssembly(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving('hold');
        setError(null);
        setSuccess(null);

        try {
            await api.holdAssembly(id, {
                heldAt: new Date().toISOString(),
                heldCallNumber: holdForm.heldCallNumber,
                totalVotingMembers: holdForm.totalVotingMembers,
                presentVotingMembers: holdForm.presentVotingMembers,
                chairMemberId: holdForm.chairMemberId || undefined,
                secretaryMemberId: holdForm.secretaryMemberId || undefined
            });
            setSuccess('Assembleia realizada com quorum validado.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao realizar assembleia.');
        } finally {
            setSaving(null);
        }
    }

    async function addDeliberation(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving('deliberation');
        setError(null);
        setSuccess(null);

        try {
            await api.addAssemblyDeliberation(id, {
                agendaItem: deliberationForm.agendaItem,
                decision: deliberationForm.decision,
                requiredQuorum: deliberationForm.requiredQuorum,
                votesFor: deliberationForm.votesFor ? Number(deliberationForm.votesFor) : undefined,
                votesAgainst: deliberationForm.votesAgainst ? Number(deliberationForm.votesAgainst) : undefined,
                abstentions: deliberationForm.abstentions ? Number(deliberationForm.abstentions) : undefined
            });
            setDeliberationForm({ agendaItem: '', decision: '', requiredQuorum: 'SIMPLE', votesFor: '', votesAgainst: '', abstentions: '' });
            setSuccess('Deliberacao registrada.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao registrar deliberacao.');
        } finally {
            setSaving(null);
        }
    }

    async function registerMinutes(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving('minutes');
        setError(null);
        setSuccess(null);

        try {
            await api.registerMinutes(id, minutesContent);
            setSuccess('Ata registrada.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao registrar ata.');
        } finally {
            setSaving(null);
        }
    }

    async function generate(kind: 'minute' | 'presence') {
        try {
            setSaving(kind);
            setError(null);
            setDocument(kind === 'minute'
                ? await api.generateAssemblyMinute(id)
                : await api.generatePresenceList(id)
            );
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar documento.');
        } finally {
            setSaving(null);
        }
    }

    return (
        <InstitutionalLayout title="Assembleia" activePath="/assembleias">
            <div className="space-y-6">
                <Link href="/assembleias" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
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

                {document && (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                        <span>{document.title} gerado.</span>
                        <a href={api.generatedDocumentDownloadUrl(document.id)} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/10">
                            <Download size={14} />
                            Baixar
                        </a>
                    </div>
                )}

                {!hasAssociation && <AssociationRequired message="A tela usa a associacao da assembleia para carregar os membros, mas defina a associacao ativa no topo para operar o modulo com consistencia." />}

                {loading ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Carregando assembleia...</div>
                ) : assembly ? (
                    <>
                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-100">{assembly.title || assemblyTypeLabels[assembly.type]}</h2>
                                    <p className="mt-1 text-sm text-slate-400">{assemblyTypeLabels[assembly.type]} em {formatDate(assembly.scheduledDate)}</p>
                                    <p className="mt-3 max-w-4xl text-sm text-slate-300">{assembly.address || assembly.location || 'Local nao informado'}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href="/eleicoes/nova" className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800">
                                        Nova eleicao
                                    </Link>
                                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">{assemblyStatusLabels[assembly.status]}</span>
                                    {assembly.quorumMet && <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">Quorum validado</span>}
                                </div>
                            </div>
                            <div className="mt-5 grid gap-4 text-sm md:grid-cols-4">
                                <div><span className="block text-xs uppercase text-slate-500">Convocante</span>{assembly.convenerType || '-'}</div>
                                <div><span className="block text-xs uppercase text-slate-500">Meio</span>{assembly.callMethod || '-'}</div>
                                <div><span className="block text-xs uppercase text-slate-500">Prazo</span>{assembly.callNoticeDays} dias</div>
                                <div><span className="block text-xs uppercase text-slate-500">Presencas</span>{assembly.attendances.filter((item) => item.present).length}</div>
                            </div>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <Users size={18} />
                                    <h3 className="font-semibold">Presenca</h3>
                                </div>
                                <form onSubmit={addAttendance} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                                    <div>
                                        <label className={labelClass}>Associado</label>
                                        <select value={attendanceForm.memberId} onChange={(event) => setAttendanceForm({ ...attendanceForm, memberId: event.target.value, externalName: '' })} className={inputClass}>
                                            <option value="">Participante externo</option>
                                            {activeMembers.map((member) => (
                                                <option key={member.id} value={member.id}>{member.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Nome externo</label>
                                        <input value={attendanceForm.externalName} onChange={(event) => setAttendanceForm({ ...attendanceForm, externalName: event.target.value })} className={inputClass} disabled={Boolean(attendanceForm.memberId)} />
                                    </div>
                                    <button type="submit" disabled={saving === 'attendance'} className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                                        <Plus size={16} />
                                        Adicionar
                                    </button>
                                </form>
                                <div className="mt-5 divide-y divide-slate-800">
                                    {assembly.attendances.length === 0 ? (
                                        <p className="py-5 text-sm text-slate-400">Nenhuma presenca registrada.</p>
                                    ) : assembly.attendances.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between py-3 text-sm">
                                            <span className="text-slate-200">{item.member?.fullName || item.externalName}</span>
                                            <span className="text-xs text-slate-500">{item.hasVotingRight ? 'Com voto' : 'Sem voto'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={holdAssembly} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <CheckCircle size={18} />
                                    <h3 className="font-semibold">Realizacao e quorum</h3>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>Chamada usada</label>
                                        <select value={holdForm.heldCallNumber} onChange={(event) => setHoldForm({ ...holdForm, heldCallNumber: Number(event.target.value) })} className={inputClass}>
                                            <option value={1}>Primeira chamada</option>
                                            <option value={2}>Segunda chamada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Associados aptos</label>
                                        <input type="number" min={0} value={holdForm.totalVotingMembers} onChange={(event) => setHoldForm({ ...holdForm, totalVotingMembers: Number(event.target.value) })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Presentes com voto</label>
                                        <input type="number" min={0} value={holdForm.presentVotingMembers} onChange={(event) => setHoldForm({ ...holdForm, presentVotingMembers: Number(event.target.value) })} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Presidente da mesa</label>
                                        <select value={holdForm.chairMemberId} onChange={(event) => setHoldForm({ ...holdForm, chairMemberId: event.target.value })} className={inputClass}>
                                            <option value="">Nao informado</option>
                                            {activeMembers.map((member) => <option key={member.id} value={member.id}>{member.fullName}</option>)}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Secretario da assembleia</label>
                                        <select value={holdForm.secretaryMemberId} onChange={(event) => setHoldForm({ ...holdForm, secretaryMemberId: event.target.value })} className={inputClass}>
                                            <option value="">Nao informado</option>
                                            {activeMembers.map((member) => <option key={member.id} value={member.id}>{member.fullName}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" disabled={saving === 'hold' || assembly.status !== 'CALLED'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    <Save size={16} />
                                    Validar realizacao
                                </button>
                            </form>
                        </div>

                        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                            <form onSubmit={addDeliberation} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <ListChecks size={18} />
                                    <h3 className="font-semibold">Deliberacoes</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Item da pauta</label>
                                        <select value={deliberationForm.agendaItem} onChange={(event) => setDeliberationForm({ ...deliberationForm, agendaItem: event.target.value })} className={inputClass}>
                                            <option value="">Selecione</option>
                                            {assembly.agenda.map((item) => <option key={item} value={item}>{item}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Decisao</label>
                                        <textarea required value={deliberationForm.decision} onChange={(event) => setDeliberationForm({ ...deliberationForm, decision: event.target.value })} className={`${inputClass} min-h-24`} />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-4">
                                        <div>
                                            <label className={labelClass}>Quorum</label>
                                            <select value={deliberationForm.requiredQuorum} onChange={(event) => setDeliberationForm({ ...deliberationForm, requiredQuorum: event.target.value })} className={inputClass}>
                                                <option value="SIMPLE">Simples</option>
                                                <option value="TWO_THIRDS">2/3</option>
                                            </select>
                                        </div>
                                        <div><label className={labelClass}>A favor</label><input type="number" min={0} value={deliberationForm.votesFor} onChange={(event) => setDeliberationForm({ ...deliberationForm, votesFor: event.target.value })} className={inputClass} /></div>
                                        <div><label className={labelClass}>Contra</label><input type="number" min={0} value={deliberationForm.votesAgainst} onChange={(event) => setDeliberationForm({ ...deliberationForm, votesAgainst: event.target.value })} className={inputClass} /></div>
                                        <div><label className={labelClass}>Abstencoes</label><input type="number" min={0} value={deliberationForm.abstentions} onChange={(event) => setDeliberationForm({ ...deliberationForm, abstentions: event.target.value })} className={inputClass} /></div>
                                    </div>
                                </div>
                                <button type="submit" disabled={saving === 'deliberation'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                                    <Plus size={16} />
                                    Registrar deliberacao
                                </button>
                                <div className="mt-5 divide-y divide-slate-800">
                                    {assembly.deliberations.map((item) => (
                                        <div key={item.id} className="py-3 text-sm">
                                            <div className="flex justify-between gap-3">
                                                <span className="font-medium text-slate-100">{item.agendaItem}</span>
                                                <span className={item.result === 'APPROVED' ? 'text-emerald-300' : 'text-rose-300'}>{item.result === 'APPROVED' ? 'Aprovada' : 'Rejeitada'}</span>
                                            </div>
                                            <p className="mt-1 text-slate-400">{item.decision}</p>
                                        </div>
                                    ))}
                                </div>
                            </form>

                            <form onSubmit={registerMinutes} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <div className="mb-5 flex items-center gap-2 text-slate-100">
                                    <FileText size={18} />
                                    <h3 className="font-semibold">Ata e documentos</h3>
                                </div>
                                <label className={labelClass}>Teor da ata</label>
                                <textarea required value={minutesContent} onChange={(event) => setMinutesContent(event.target.value)} className={`${inputClass} min-h-64 font-mono`} />
                                <div className="mt-5 grid gap-3 md:grid-cols-3">
                                    <button type="submit" disabled={saving === 'minutes' || assembly.status === 'CALLED'} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                                        <Save size={16} />
                                        Registrar ata
                                    </button>
                                    <button type="button" onClick={() => generate('minute')} disabled={Boolean(saving)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60">
                                        <FileText size={16} />
                                        Gerar ata
                                    </button>
                                    <button type="button" onClick={() => generate('presence')} disabled={Boolean(saving)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-60">
                                        <ListChecks size={16} />
                                        Presenca
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Assembleia nao encontrada.</div>
                )}
            </div>
        </InstitutionalLayout>
    );
}
