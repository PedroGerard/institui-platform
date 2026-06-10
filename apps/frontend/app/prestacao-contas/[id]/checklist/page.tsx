'use client';

import { use, useEffect, useState } from 'react';
import { AccountabilityProjectNav } from '@/components/accountability/AccountabilityProjectNav';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { AccountabilityChecklistDTO } from '@/types/dtos';
import { documentTypeLabels } from '@/lib/institutional';
import { AlertCircle, CheckCircle, RefreshCw, XCircle } from 'lucide-react';

export default function AccountabilityChecklistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const [checklist, setChecklist] = useState<AccountabilityChecklistDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadChecklist() {
        try {
            setLoading(true);
            setError(null);
            setChecklist(await api.getAccountabilityChecklist(projectId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar checklist.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadChecklist();
    }, [projectId]);

    return (
        <InstitutionalLayout title="Checklist" activePath="/prestacao-contas">
            <div className="space-y-6">
                <AccountabilityProjectNav projectId={projectId} active="/checklist" />

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-sm text-slate-400">Carregando checklist...</div>
                ) : checklist ? (
                    <>
                        <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-500">Conclusao documental</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-100">{checklist.completionPercentage}%</p>
                                </div>
                                <button onClick={loadChecklist} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
                                    <RefreshCw size={16} />
                                    Atualizar
                                </button>
                            </div>
                            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                                <div className="h-full rounded-full bg-blue-500" style={{ width: `${checklist.completionPercentage}%` }} />
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                            <div className="min-w-[820px]">
                                <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                                    <span>Documento</span>
                                    <span>Obrigatorio</span>
                                    <span>Enviado</span>
                                    <span>Validado</span>
                                    <span>Pendencia</span>
                                </div>
                                <div className="divide-y divide-slate-800">
                                    {checklist.items.map((item) => (
                                        <div key={item.type} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] items-center gap-4 px-5 py-4 text-sm">
                                            <span className="text-slate-100">{documentTypeLabels[item.type]}</span>
                                            <span className="text-slate-300">{item.required ? 'Sim' : 'Nao'}</span>
                                            <span className={item.sent ? 'text-emerald-300' : 'text-rose-300'}>{item.sent ? 'Sim' : 'Nao'}</span>
                                            <span className={item.validated ? 'text-emerald-300' : 'text-amber-300'}>{item.validated ? 'Sim' : 'Nao'}</span>
                                            <span className="flex items-center gap-2">
                                                {item.pending ? <XCircle size={16} className="text-rose-300" /> : <CheckCircle size={16} className="text-emerald-300" />}
                                                <span className={item.pending ? 'text-rose-300' : 'text-emerald-300'}>{item.pending ? 'Pendente' : 'Ok'}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={`rounded-lg border p-5 text-sm ${checklist.canSubmit ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-200'}`}>
                            {checklist.canSubmit ? (
                                <span>Prestacao apta para submissao.</span>
                            ) : (
                                <div>
                                    <p className="font-semibold">Bloqueios:</p>
                                    <ul className="mt-2 space-y-1">
                                        {checklist.blockingReasons.map((reason) => <li key={reason}>- {reason}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </InstitutionalLayout>
    );
}
