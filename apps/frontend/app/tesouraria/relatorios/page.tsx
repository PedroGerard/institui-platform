'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Download, FileSpreadsheet, FileText, RefreshCw } from 'lucide-react';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { api } from '@/services/api';
import { TreasuryReportDTO, TreasuryReportType } from '@/types/dtos';
import { formatDate, treasuryReportTypeLabels } from '@/lib/institutional';

export default function TreasuryReportsPage() {
    const { associationId, hasAssociation } = useActiveAssociation();
    const [reports, setReports] = useState<TreasuryReportDTO[]>([]);
    const [type, setType] = useState<TreasuryReportType | ''>('');
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState<'PDF' | 'XLS' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function loadData() {
        if (!associationId) {
            setReports([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setReports(await api.listTreasuryReports({
                associationId,
                type: type || undefined
            }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar relatorios.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [associationId, type]);

    async function generate(format: 'PDF' | 'XLS') {
        try {
            setGenerating(format);
            setError(null);
            setSuccess(null);
            if (!associationId) {
                throw new Error('Defina a associacao ativa antes de gerar relatorio.');
            }

            const report = await api.generateTreasuryPaymentReport(format, associationId);
            setSuccess(`${report.title} gerado.`);
            await loadData();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar relatorio.');
        } finally {
            setGenerating(null);
        }
    }

    return (
        <InstitutionalLayout title="Relatorios" activePath="/tesouraria/relatorios">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Relatorios da Tesouraria</h2>
                        <p className="mt-1 text-sm text-slate-400">Relatorios exportaveis para acompanhamento do Conselho Fiscal.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={type}
                            onChange={(event) => setType(event.target.value as TreasuryReportType | '')}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                        >
                            <option value="">Todos os tipos</option>
                            {Object.entries(treasuryReportTypeLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={loadData}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        <button
                            type="button"
                            onClick={() => generate('PDF')}
                            disabled={Boolean(generating) || !hasAssociation}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            <FileText size={16} />
                            {generating === 'PDF' ? 'Gerando...' : 'Gerar PDF'}
                        </button>
                        <button
                            type="button"
                            onClick={() => generate('XLS')}
                            disabled={Boolean(generating) || !hasAssociation}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                            <FileSpreadsheet size={16} />
                            {generating === 'XLS' ? 'Gerando...' : 'Gerar XLS'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                        {success}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired />}

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <div className="min-w-[860px]">
                        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_120px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Titulo</span>
                            <span>Tipo</span>
                            <span>Gerado em</span>
                            <span>Responsavel</span>
                            <span className="text-right">Download</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando relatorios...</div>
                        ) : reports.length === 0 ? (
                            <div className="px-5 py-12 text-center text-sm text-slate-400">Nenhum relatorio gerado.</div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {reports.map((report) => (
                                    <div key={report.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_120px] items-center gap-4 px-5 py-4 text-sm">
                                        <span className="min-w-0 break-words font-medium text-slate-100">{report.title}</span>
                                        <span className="text-slate-300">{treasuryReportTypeLabels[report.type]}</span>
                                        <span className="text-slate-300">{formatDate(report.createdAt)}</span>
                                        <span className="min-w-0 break-words text-slate-300">{report.generatedBy?.name || report.generatedById}</span>
                                        <div className="flex justify-end">
                                            <a href={api.treasuryReportDownloadUrl(report)} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800">
                                                <Download size={14} />
                                                Baixar
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </InstitutionalLayout>
    );
}
