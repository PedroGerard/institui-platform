'use client';

import { use, useEffect, useState } from 'react';
import { AccountabilityProjectNav } from '@/components/accountability/AccountabilityProjectNav';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { api } from '@/services/api';
import { AccountabilityReportDTO, ReportType } from '@/types/dtos';
import { formatDate, reportTypeLabels } from '@/lib/institutional';
import { AlertCircle, CheckCircle, Download, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';

export default function AccountabilityReportsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: projectId } = use(params);
    const [reports, setReports] = useState<AccountabilityReportDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState<ReportType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    async function loadReports() {
        try {
            setLoading(true);
            setError(null);
            setReports(await api.listAccountabilityReports(projectId));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar relatorios.');
        } finally {
            setLoading(false);
        }
    }

    async function generateReport(type: ReportType) {
        try {
            setGenerating(type);
            setMessage(null);
            setError(null);
            await api.generateAccountabilityReport(projectId, type);
            setMessage(`Relatorio ${type} gerado.`);
            await loadReports();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar relatorio.');
        } finally {
            setGenerating(null);
        }
    }

    useEffect(() => {
        loadReports();
    }, [projectId]);

    return (
        <InstitutionalLayout title="Relatorios" activePath="/prestacao-contas">
            <div className="space-y-6">
                <AccountabilityProjectNav projectId={projectId} active="/relatorios" />

                {(error || message) && (
                    <div className={`flex items-center gap-3 rounded-lg border p-4 text-sm ${message
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                        }`}>
                        {message ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message || error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <button onClick={() => generateReport('PDF')} disabled={Boolean(generating)} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-5 text-left hover:border-blue-500/60 disabled:cursor-not-allowed disabled:opacity-60">
                        <span>
                            <span className="block text-lg font-semibold text-slate-100">Gerar PDF</span>
                            <span className="mt-1 block text-sm text-slate-400">Relatorio oficial para leitura e arquivo.</span>
                        </span>
                        <FileText className="text-blue-300" size={24} />
                    </button>
                    <button onClick={() => generateReport('XLS')} disabled={Boolean(generating)} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 p-5 text-left hover:border-blue-500/60 disabled:cursor-not-allowed disabled:opacity-60">
                        <span>
                            <span className="block text-lg font-semibold text-slate-100">Gerar XLS</span>
                            <span className="mt-1 block text-sm text-slate-400">Planilha tabular para conferencia externa.</span>
                        </span>
                        <FileSpreadsheet className="text-emerald-300" size={24} />
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <div className="min-w-[720px]">
                        <div className="grid grid-cols-[1fr_1fr_1.4fr_120px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Tipo</span>
                            <span>Gerado em</span>
                            <span>Arquivo</span>
                            <span className="text-right">Download</span>
                        </div>
                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando relatorios...</div>
                        ) : reports.length === 0 ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Nenhum relatorio gerado.</div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {reports.map((report) => (
                                    <div key={report.id} className="grid grid-cols-[1fr_1fr_1.4fr_120px] items-center gap-4 px-5 py-4 text-sm">
                                        <span className="text-slate-200">{reportTypeLabels[report.type]}</span>
                                        <span className="text-slate-300">{formatDate(report.generatedAt)}</span>
                                        <span className="truncate font-mono text-xs text-slate-500">{report.fileUrl}</span>
                                        <a href={api.accountabilityReportDownloadUrl(report)} className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800">
                                            <Download size={14} />
                                            Baixar
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button onClick={loadReports} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
                    <RefreshCw size={16} />
                    Atualizar lista
                </button>
            </div>
        </InstitutionalLayout>
    );
}
