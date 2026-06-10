'use client';

import { FormEvent, use, useEffect, useState } from 'react';
import { AccountabilityProjectNav } from '@/components/accountability/AccountabilityProjectNav';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { AccountabilityProjectDTO, FiscalOpinionDTO, FiscalOpinionType } from '@/types/dtos';
import { fiscalOpinionLabels, formatDate } from '@/lib/institutional';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500";
const labelClass = "mb-2 block text-xs font-semibold uppercase text-slate-500";

export default function FiscalOpinionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const [project, setProject] = useState<AccountabilityProjectDTO | null>(null);
    const [opinions, setOpinions] = useState<FiscalOpinionDTO[]>([]);
    const [councilUserId, setCouncilUserId] = useState('');
    const [opinion, setOpinion] = useState<FiscalOpinionType>('APPROVED');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const [projectData, opinionData] = await Promise.all([
                api.getAccountabilityProject(projectId),
                api.listFiscalOpinions(projectId)
            ]);
            setProject(projectData);
            setOpinions(opinionData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar pareceres.');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSaving(true);
        setError(null);
        setMessage(null);

        try {
            await api.registerFiscalOpinion(projectId, {
                councilUserId,
                opinion,
                notes: notes || undefined
            });
            setNotes('');
            setMessage('Parecer registrado.');
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao registrar parecer.');
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [projectId]);

    return (
        <InstitutionalLayout title="Parecer fiscal" activePath="/prestacao-contas">
            <div className="space-y-6">
                <AccountabilityProjectNav projectId={projectId} active="/parecer" />

                {(error || message) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${message
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {message ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message || error}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Carregando parecer...</div>
                ) : (
                    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                        <div className="space-y-6">
                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <h2 className="text-xl font-semibold text-slate-100">Resumo da prestacao</h2>
                                {project && (
                                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                                        <p><span className="text-slate-500">Projeto:</span> {project.name}</p>
                                        <p><span className="text-slate-500">Concedente:</span> {project.grantor}</p>
                                        <p><span className="text-slate-500">Periodo:</span> {formatDate(project.periodStart)} a {formatDate(project.periodEnd)}</p>
                                        <p><span className="text-slate-500">Documentos:</span> {project.documents?.length || 0}</p>
                                        <p><span className="text-slate-500">Relatorios:</span> {project.reports?.length || 0}</p>
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                                <h3 className="text-lg font-semibold text-slate-100">Historico de pareceres</h3>
                                {opinions.length === 0 ? (
                                    <p className="mt-4 text-sm text-slate-400">Nenhum parecer registrado.</p>
                                ) : (
                                    <div className="mt-4 space-y-3">
                                        {opinions.map((item) => (
                                            <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <span className={item.opinion === 'APPROVED' ? 'font-semibold text-emerald-300' : 'font-semibold text-rose-300'}>{fiscalOpinionLabels[item.opinion]}</span>
                                                    <span className="text-xs text-slate-500">{formatDate(item.signedAt)}</span>
                                                </div>
                                                <p className="mt-2 text-slate-400">{item.notes || 'Sem observacoes.'}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                            <h3 className="text-lg font-semibold text-slate-100">Registrar parecer</h3>
                            <div className="mt-5 space-y-5">
                                <div>
                                    <label className={labelClass}>Usuario do Conselho Fiscal</label>
                                    <input required value={councilUserId} onChange={(event) => setCouncilUserId(event.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Parecer</label>
                                    <select value={opinion} onChange={(event) => setOpinion(event.target.value as FiscalOpinionType)} className={inputClass}>
                                        <option value="APPROVED">Aprovado</option>
                                        <option value="REJECTED">Rejeitado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Observacoes</label>
                                    <textarea rows={8} value={notes} onChange={(event) => setNotes(event.target.value)} className={inputClass} />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end border-t border-slate-800 pt-6">
                                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    <Save size={17} />
                                    {saving ? 'Registrando...' : 'Registrar parecer'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </InstitutionalLayout>
    );
}
