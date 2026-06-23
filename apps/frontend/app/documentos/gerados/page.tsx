'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InstitutionalLayout from '@/components/layout/InstitutionalLayout';
import { AssociationRequired } from '@/components/layout/AssociationRequired';
import { PermissionRequired } from '@/components/layout/PermissionRequired';
import { useActiveAssociation } from '@/contexts/ActiveAssociationContext';
import { useActiveOperator } from '@/contexts/ActiveOperatorContext';
import { api } from '@/services/api';
import { GeneratedDocumentDTO, GeneratedDocumentType } from '@/types/dtos';
import { formatDate, generatedDocumentTypeLabels } from '@/lib/institutional';
import { AlertCircle, Download, FileText, Plus, RefreshCw } from 'lucide-react';

const documentTypes = Object.keys(generatedDocumentTypeLabels) as GeneratedDocumentType[];

export default function GeneratedDocumentsPage() {
    const { associationId, hasAssociation } = useActiveAssociation();
    const { hasOperator, hasPermission, loadingPermissions } = useActiveOperator();
    const [documents, setDocuments] = useState<GeneratedDocumentDTO[]>([]);
    const [typeFilter, setTypeFilter] = useState<GeneratedDocumentType | 'ALL'>('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filteredDocuments = useMemo(() => documents, [documents]);

    async function loadDocuments() {
        if (!associationId) {
            setDocuments([]);
            setLoading(false);
            return;
        }

        if (loadingPermissions) return;

        if (!hasOperator || !hasPermission('DOCUMENTS_READ')) {
            setDocuments([]);
            setLoading(false);
            setError('Usuario operador sem permissao para consultar documentos.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setDocuments(await api.listGeneratedDocuments({
                associationId,
                type: typeFilter === 'ALL' ? undefined : typeFilter
            }));
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar documentos.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDocuments();
    }, [associationId, typeFilter, hasOperator, hasPermission, loadingPermissions]);

    const canReadDocuments = hasPermission('DOCUMENTS_READ');
    const canGenerateDocuments = hasPermission('DOCUMENTS_GENERATE');

    return (
        <InstitutionalLayout title="Documentos gerados" activePath="/documentos/gerados">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Documentos gerados</h2>
                        <p className="mt-1 text-sm text-slate-400">{documents.length} registro(s) encontrados</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <select
                            value={typeFilter}
                            onChange={(event) => setTypeFilter(event.target.value as GeneratedDocumentType | 'ALL')}
                            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
                        >
                            <option value="ALL">Todos os tipos</option>
                            {documentTypes.map((type) => (
                                <option key={type} value={type}>{generatedDocumentTypeLabels[type]}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={loadDocuments}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Atualizar
                        </button>
                        {canGenerateDocuments ? (
                            <Link
                                href="/documentos/gerar"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Plus size={16} />
                                Gerar
                            </Link>
                        ) : (
                            <span className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 opacity-70">
                                <Plus size={16} />
                                Gerar
                            </span>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                {!hasAssociation && <AssociationRequired />}
                {hasAssociation && !loadingPermissions && (!hasOperator || !canReadDocuments) && (
                    <PermissionRequired message="Selecione um operador com permissao de leitura de documentos." />
                )}

                <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                    <div className="min-w-[920px]">
                        <div className="grid grid-cols-[1.5fr_1fr_1fr_1.4fr_120px] gap-4 border-b border-slate-800 px-5 py-3 text-xs font-semibold uppercase text-slate-500">
                            <span>Titulo</span>
                            <span>Tipo</span>
                            <span>Gerado em</span>
                            <span>Origem</span>
                            <span className="text-right">PDF</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm text-slate-400">Carregando documentos...</div>
                        ) : filteredDocuments.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center text-slate-400">
                                <FileText size={28} />
                                <span className="text-sm">Nenhum documento gerado.</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800">
                                {filteredDocuments.map((document) => (
                                    <div key={document.id} className="grid grid-cols-[1.5fr_1fr_1fr_1.4fr_120px] items-center gap-4 px-5 py-4 text-sm">
                                        <div>
                                            <p className="font-medium text-slate-100">{document.title}</p>
                                            <p className="font-mono text-xs text-slate-500">{document.hash?.slice(0, 18) || 'sem hash'}</p>
                                        </div>
                                        <span className="text-slate-300">{generatedDocumentTypeLabels[document.type]}</span>
                                        <span className="text-slate-300">{formatDate(document.createdAt)}</span>
                                        <span className="font-mono text-xs text-slate-400">{document.referenceId || 'emissao avulsa'}</span>
                                        <a
                                            href={api.generatedDocumentDownloadUrl(document.id)}
                                            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
                                        >
                                            <Download size={14} />
                                            Baixar
                                        </a>
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
