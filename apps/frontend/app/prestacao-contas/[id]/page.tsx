'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AccountabilityProjectNav } from '@/components/accountability/AccountabilityProjectNav';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { AccountabilityChecklistDTO, AccountabilityProjectDTO, AccountabilityStatus, GeneratedDocumentDTO } from '@/types/dtos';
import { accountabilityStatusLabels, formatDate, instrumentTypeLabels } from '@/lib/institutional';
import { AlertCircle, CheckCircle, Download, FileSignature, RefreshCw, Send } from 'lucide-react';

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
    return (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
            <p className="mt-3 text-2xl font-bold text-slate-100">{value}</p>
            <p className="mt-1 text-sm text-slate-400">{hint}</p>
        </div>
    );
}

export default function AccountabilityProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const [project, setProject] = useState<AccountabilityProjectDTO | null>(null);
    const [checklist, setChecklist] = useState<AccountabilityChecklistDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [officialOpinion, setOfficialOpinion] = useState<GeneratedDocumentDTO | null>(null);

    const latestOpinion = useMemo(() => project?.fiscalOpinions?.[0], [project]);

    async function loadProject() {
        try {
            setLoading(true);
            setError(null);
            const [projectData, checklistData] = await Promise.all([
                api.getAccountabilityProject(projectId),
                api.getAccountabilityChecklist(projectId)
            ]);
            setProject(projectData);
            setChecklist(checklistData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar prestacao.');
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(status: AccountabilityStatus) {
        try {
            setActionLoading('status');
            setMessage(null);
            setError(null);
            await api.updateAccountabilityProjectStatus(projectId, status);
            setMessage('Status atualizado.');
            await loadProject();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar status.');
        } finally {
            setActionLoading(null);
        }
    }

    async function submitProject() {
        try {
            setActionLoading('submit');
            setMessage(null);
            setError(null);
            await api.submitAccountabilityProject(projectId);
            setMessage('Prestacao submetida com sucesso.');
            await loadProject();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Submissao bloqueada.');
        } finally {
            setActionLoading(null);
        }
    }

    async function generateOfficialFiscalOpinion() {
        try {
            setActionLoading('official-opinion');
            setMessage(null);
            setError(null);
            const document = await api.generateFiscalOpinion(projectId);
            setOfficialOpinion(document);
            setMessage('Parecer fiscal oficial gerado.');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar parecer oficial.');
        } finally {
            setActionLoading(null);
        }
    }

    useEffect(() => {
        loadProject();
    }, [projectId]);

    return (
        <InstitutionalLayout title="Prestacao de contas" activePath="/prestacao-contas">
            <div className="space-y-6">
                <AccountabilityProjectNav projectId={projectId} active="" />

                {(error || message) && (
                    <div className={`flex items-center justify-between gap-3 rounded-lg border p-4 text-sm ${message
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            {message || error}
                        </div>
                        {officialOpinion && (
                            <a href={api.generatedDocumentDownloadUrl(officialOpinion.id)} className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/10">
                                <Download size={14} />
                                Baixar parecer
                            </a>
                        )}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Carregando prestacao...</div>
                ) : project && checklist ? (
                    <>
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-100">{project.name}</h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    {project.grantor} - {instrumentTypeLabels[project.instrumentType]} - {formatDate(project.periodStart)} a {formatDate(project.periodEnd)}
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <select value={project.status} onChange={(event) => updateStatus(event.target.value as AccountabilityStatus)} disabled={actionLoading === 'status'} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500">
                                    {Object.entries(accountabilityStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                                <button onClick={loadProject} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
                                    <RefreshCw size={16} />
                                    Atualizar
                                </button>
                                <button onClick={submitProject} disabled={Boolean(actionLoading)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                                    <Send size={16} />
                                    Submeter
                                </button>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                            <MetricCard label="Status" value={accountabilityStatusLabels[project.status]} hint="Situacao atual" />
                            <MetricCard label="Pendencias" value={String(checklist.pendingRequired)} hint="Documentos obrigatorios" />
                            <MetricCard label="Checklist" value={`${checklist.completionPercentage}%`} hint={`${checklist.completedRequired}/${checklist.totalRequired} validados`} />
                            <MetricCard label="Parecer fiscal" value={checklist.hasApprovedFiscalOpinion ? 'Aprovado' : latestOpinion ? 'Registrado' : 'Pendente'} hint={latestOpinion ? formatDate(latestOpinion.signedAt) : 'Sem parecer'} />
                            <MetricCard label="Relatorios" value={String(project.reports?.length || 0)} hint="Arquivos gerados" />
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                                <h3 className="text-lg font-semibold text-slate-100">Bloqueios de submissao</h3>
                                {checklist.blockingReasons.length === 0 ? (
                                    <p className="mt-3 text-sm text-emerald-300">Prestacao apta para submissao.</p>
                                ) : (
                                    <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                        {checklist.blockingReasons.map((reason) => <li key={reason}>- {reason}</li>)}
                                    </ul>
                                )}
                            </div>

                            <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                                <h3 className="text-lg font-semibold text-slate-100">Acoes rapidas</h3>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Link href={`/prestacao-contas/${projectId}/documentos`} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">Anexar documentos</Link>
                                    <Link href={`/prestacao-contas/${projectId}/parecer`} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">Registrar parecer</Link>
                                    <button onClick={generateOfficialFiscalOpinion} disabled={Boolean(actionLoading)} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                                        <FileSignature size={15} />
                                        Gerar Parecer Fiscal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </InstitutionalLayout>
    );
}
